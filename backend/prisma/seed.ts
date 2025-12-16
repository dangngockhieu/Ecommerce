import { Pool } from 'pg';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';

dotenv.config();

// Tạo kết nối
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const client = await pool.connect();
  console.log('Bắt đầu seed dữ liệu');

  try {
    // === BẮT ĐẦU TRANSACTION ===
    await client.query('BEGIN');

    await client.query(`
      TRUNCATE TABLE 
        "reviews", "payments", "order_items", "orders", 
        "product_features", "features", "products", "users", "carts", "product_images"
      RESTART IDENTITY CASCADE
    `);

    // TẠO USERS
    console.log('Đang tạo Users...');
    const passwordHash = await argon2.hash('123456');

    const usersData = [
      { name: "Admin", email: "admin@gmail.com", role: "ADMIN" },
      { name: "User", email: "user@gmail.com", role: "USER" },
      { name: "Nguyễn Văn A", email: "a@gmail.com", role: "USER" },
      { name: "Trần Thị B", email: "b@gmail.com", role: "USER" },
      { name: "Lê Văn C", email: "c@gmail.com", role: "USER" },
    ];

    const insertedUsers = [];
    for (const u of usersData) {
      const q = `
        INSERT INTO "users" (name, email, password, role, "isVerified")
        VALUES ($1, $2, $3, $4, true)
        RETURNING *
      `;
      const res = await client.query(q, [u.name, u.email, passwordHash, u.role]);
      insertedUsers.push(res.rows[0]);
    }
    console.log(`Đã tạo ${insertedUsers.length} users.`);


    // TẠO FEATURES (TÍNH NĂNG)
    console.log('Đang tạo Features...');
    const featureNames = [
      "Văn phòng", "Gaming", "Mỏng nhẹ", "Đồ họa", "Cảm ứng", 
      "Laptop AI", "Điện thoại 5G", "Điện thoại AI", 
      "Gaming Phone", "Phổ thông 4G", "Điện thoại gập"
    ];

    const featureMap = new Map<string, number>();

    for (const name of featureNames) {
      const q = 'INSERT INTO "features" (name) VALUES ($1) RETURNING id, name';
      const res = await client.query(q, [name]);
      featureMap.set(res.rows[0].name, res.rows[0].id);
    }
    console.log(`Đã tạo ${featureMap.size} features.`);
    const getF = (name: string) => featureMap.get(name);


    // TẠO PRODUCTS (SẢN PHẨM)
    console.log('Đang tạo Products...');

    const productsData = [
      // --- LAPTOPS ---
      {
        name: "Dell Inspiron 15", originalPrice: 20000000, price: 18000000, coupon: 10, quantity: 20, warranty: "12 tháng",
        infor: "Laptop học tập và làm việc hiệu năng tốt.", cpu: "Intel Core i5", ram: "8GB", storage: "512GB SSD",
        screen: "15.6 inch Full HD", graphicsCard: "Intel Iris Xe", battery: "56Wh", weight: "1.7kg",
        releaseYear: "2024", category: "LAPTOP", factory: "DELL"
      },
      {
        name: "HP Pavilion 14", originalPrice: 19000000, price: 17000000, coupon: 10, quantity: 25, warranty: "12 tháng",
        infor: "Thiết kế nhỏ gọn, tiện lợi di chuyển.", cpu: "Intel Core i7", ram: "16GB", storage: "512GB SSD",
        screen: "14 inch Full HD", graphicsCard: "Intel Iris Xe", battery: "50Wh", weight: "1.5kg",
        releaseYear: "2024", category: "LAPTOP", factory: "HP"
      },
      {
        name: "ASUS TUF Gaming F15", originalPrice: 25000000, price: 23000000, coupon: 8, quantity: 15, warranty: "24 tháng",
        infor: "Laptop gaming hiệu năng mạnh mẽ, bền bỉ.", cpu: "Intel Core i7", ram: "16GB", storage: "1TB SSD",
        screen: "15.6 inch Full HD", graphicsCard: "RTX 4060", battery: "90Wh", weight: "2.2kg",
        releaseYear: "2024", category: "LAPTOP", factory: "ASUS"
      },
      {
        name: "Lenovo ThinkPad X1 Carbon", originalPrice: 30000000, price: 28000000, coupon: 7, quantity: 10, warranty: "36 tháng",
        infor: "Siêu mỏng nhẹ, pin trâu, hiệu suất cao.", cpu: "Intel Core i7", ram: "16GB", storage: "1TB SSD",
        screen: "14 inch 2K IPS", graphicsCard: "Intel Iris Xe", battery: "57Wh", weight: "1.1kg",
        releaseYear: "2024", category: "LAPTOP", factory: "LENOVO"
      },
      {
        name: "MacBook Air M3 2024", originalPrice: 32000000, price: 30000000, coupon: 6, quantity: 12, warranty: "12 tháng",
        infor: "Chip M3 mới, pin cực trâu, macOS mượt mà.", cpu: "Apple M3", ram: "8GB", storage: "512GB SSD",
        screen: "13.6 inch Retina", graphicsCard: "Apple GPU", battery: "52.6Wh", weight: "1.24kg",
        releaseYear: "2024", category: "LAPTOP", factory: "MACBOOK"
      },
      // --- PHONES ---
      {
        name: "iPhone 15 Pro", originalPrice: 32000000, price: 29000000, coupon: 9, quantity: 20, warranty: "12 tháng",
        infor: "Siêu phẩm của Apple với chip A17 Pro.", cpu: "A17 Pro", ram: "8GB", storage: "256GB",
        screen: "6.1 inch OLED", graphicsCard: "Apple GPU", battery: "3300mAh", weight: "187g",
        releaseYear: "2024", category: "PHONE", factory: "IPHONE"
      },
      {
        name: "Samsung Galaxy S24 Ultra", originalPrice: 35000000, price: 32000000, coupon: 8, quantity: 15, warranty: "12 tháng",
        infor: "Camera 200MP, hiệu năng mạnh mẽ.", cpu: "Snapdragon 8 Gen 3", ram: "12GB", storage: "512GB",
        screen: "6.8 inch AMOLED", graphicsCard: "Adreno 750", battery: "5000mAh", weight: "233g",
        releaseYear: "2024", category: "PHONE", factory: "SAMSUNG"
      },
      {
        name: "Xiaomi 14 Pro", originalPrice: 25000000, price: 22000000, coupon: 10, quantity: 18, warranty: "12 tháng",
        infor: "Giá rẻ, hiệu năng cao, sạc siêu nhanh.", cpu: "Snapdragon 8 Gen 3", ram: "12GB", storage: "256GB",
        screen: "6.7 inch AMOLED", graphicsCard: "Adreno 740", battery: "4600mAh", weight: "200g",
        releaseYear: "2024", category: "PHONE", factory: "XIAOMI"
      },
      {
        name: "Oppo Find X7", originalPrice: 27000000, price: 25000000, coupon: 7, quantity: 20, warranty: "12 tháng",
        infor: "Camera đẹp, thiết kế sang trọng.", cpu: "Dimensity 9300", ram: "16GB", storage: "512GB",
        screen: "6.74 inch AMOLED", graphicsCard: "Immortalis-G720", battery: "4800mAh", weight: "210g",
        releaseYear: "2024", category: "PHONE", factory: "OPPO"
      },
      {
        name: "Samsung Galaxy Z Fold6", originalPrice: 35000000, price: 31500000, coupon: 10, quantity: 25, warranty: "12 tháng",
        infor: "Flagship killer cấu hình mạnh mẽ.", cpu: "Snapdragon 8 Gen 3", ram: "12GB", storage: "256GB",
        screen: "7.6 inch OLED", graphicsCard: "Adreno 750", battery: "5000mAh", weight: "205g",
        releaseYear: "2024", category: "PHONE", factory: "SAMSUNG"
      },
    ];

    const insertedProducts = [];
    const queryInsertProduct = `
      INSERT INTO "products" (
        name, "originalPrice", price, coupon, quantity, warranty, infor, 
        cpu, ram, storage, screen, "graphicsCard", battery, weight, 
        "releaseYear", category, factory
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING *
    `;

    for (const p of productsData) {
      const res = await client.query(queryInsertProduct, [
        p.name, p.originalPrice, p.price, p.coupon, p.quantity, p.warranty, p.infor,
        p.cpu, p.ram, p.storage, p.screen, p.graphicsCard, p.battery, p.weight,
        p.releaseYear, p.category, p.factory
      ]);
      insertedProducts.push(res.rows[0]);
    }
    console.log(`   -> Đã tạo ${insertedProducts.length} sản phẩm.`);


    // GẮN FEATURE CHO SẢN PHẨM (MAPPING)
    console.log('Đang gắn Features...');
    for (const p of insertedProducts) {
      let fIds: Array<number | undefined> = [];

      switch (p.name) {
        // Laptop
        case "Dell Inspiron 15": 
          fIds = [getF("Văn phòng")]; break;
        case "HP Pavilion 14": 
          fIds = [getF("Văn phòng"), getF("Mỏng nhẹ")]; break;
        case "ASUS TUF Gaming F15": 
          fIds = [getF("Gaming"), getF("Đồ họa")]; break;
        case "Lenovo ThinkPad X1 Carbon": 
          fIds = [getF("Văn phòng"), getF("Mỏng nhẹ")]; break;
        case "MacBook Air M3 2024": 
          fIds = [getF("Mỏng nhẹ"), getF("Laptop AI")]; break;
        
        // Phone
        case "iPhone 15 Pro": 
          fIds = [getF("Điện thoại 5G")]; break;
        case "Samsung Galaxy S24 Ultra": 
          fIds = [getF("Điện thoại 5G"), getF("Điện thoại AI")]; break;
        case "Xiaomi 14 Pro": 
          fIds = [getF("Gaming Phone"), getF("Phổ thông 4G")]; break;
        case "Oppo Find X7": 
          fIds = [getF("Gaming Phone"), getF("Điện thoại 5G")]; break;
        case "Samsung Galaxy Z Fold6": 
          fIds = [getF("Điện thoại 5G"), getF("Điện thoại gập")]; break;
      }

      // Insert vào bảng trung gian
      for (const fId of fIds) {
        if (fId) {
          await client.query(
            'INSERT INTO "product_features" ("productID", "featureID") VALUES ($1, $2)',
            [p.id, fId]
          );
        }
      }
    }


    // TẠO ORDERS VÀ REVIEWS (RANDOM)
    console.log('Đang tạo Orders và Reviews...');
    const qInsertOrder = `
      INSERT INTO "orders" 
      ("userID", "totalPrice", "recipientName", address, phone, status, "orderDate", "trackingCode", "deliveryDate", "receivedDate")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `;
    
    const qInsertOrderItem = `
      INSERT INTO "order_items" ("orderID", "productID", quantity, price, "isReviewed")
      VALUES ($1, $2, $3, $4, $5)
    `;
    
    const qInsertPayment = `
      INSERT INTO "payments" ("orderID", amount, method, status)
      VALUES ($1, $2, 'COD', 'PAID')
    `;
    
    const qInsertReview = `
      INSERT INTO "reviews" ("userID", "productID", rating, comment)
      VALUES ($1, $2, $3, $4)
    `;
    
    const qUpdateProductSold = `UPDATE "products" SET sold = sold + $1 WHERE id = $2`;

    for (const product of insertedProducts) {
      const reviewers = [...insertedUsers].sort(() => 0.5 - Math.random()).slice(0, 3);
      
      const now = new Date(); 
      const nowVN = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      for (const user of reviewers) {
        const price = Number(product.price); 
        
        // Insert Order
        const resOrder = await client.query(qInsertOrder, [
          user.id,
          price, 
          user.name, 
          "123 Đường ABC, TP.HCM",
          "0901234567", 
          "COMPLETED", 
          nowVN, 
          `TRACK-${product.id}-${user.id}`, 
          nowVN, 
          nowVN  
        ]);
        const orderID = resOrder.rows[0].id;

        // Insert Order Item
        await client.query(qInsertOrderItem, [
          orderID, product.id, 1, price, true
        ]);

        // Insert Payment
        await client.query(qInsertPayment, [
          orderID, price
        ]);

        // Insert Review
        const rating = Math.floor(Math.random() * 5) + 1;
        await client.query(qInsertReview, [
          user.id, product.id, rating, 
          `Sản phẩm ${product.name} rất tốt! Người dùng ${user.name} hài lòng.`
        ]);
      }

      // Cập nhật số lượng đã bán (sold)
      if (reviewers.length > 0) {
        await client.query(qUpdateProductSold, [reviewers.length, product.id]);
      }
    }

    // === COMMIT TRANSACTION ===
    await client.query('COMMIT');
    console.log('SEED DỮ LIỆU THÀNH CÔNG!');

  } catch (error) {
    // Nếu có lỗi thì Rollback (Hoàn tác)
    await client.query('ROLLBACK');
    console.error('Lỗi Seed:', error);
    process.exit(1);
  } finally {
    // Đóng kết nối
    client.release();
    await pool.end();
  }
}

main();