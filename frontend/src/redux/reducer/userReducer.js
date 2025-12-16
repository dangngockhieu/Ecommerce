import { USER_LOGIN_SUCCESS,
        USER_LOGOUT_SUCCESS,
        USER_REFRESH_TOKEN
        } from "../action/userAction";

const INITIAL_STATE = {
    account: {
        id: '',
        access_token: '',
        name: '',
        role: '',
        email: ''
    },
    isAuthenticated: false
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_LOGIN_SUCCESS:
            return {
                ...state, account: {
                    id: action?.payload?.user?.id,
                    access_token: action?.payload?.access_token,
                    name: action?.payload?.user?.name,
                    role: action?.payload?.user?.role,
                    email: action?.payload?.user?.email
                },
                isAuthenticated: true
            };
        case USER_REFRESH_TOKEN:
            return {
                ...state,
                account: {
                    ...state.account,
                    access_token: action.payload,
                },
            };
        case USER_LOGOUT_SUCCESS:
            return {
                ...state,
                account: {
                    id: '',
                    access_token: '',
                    name: '',
                    role: '',
                    email: ''
                },
                isAuthenticated: false
            };
        default: return state;
    }
};

export default userReducer;
