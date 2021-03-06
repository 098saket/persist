import {
    GET_USERS_ERROR,
    GET_USERS_SUCCESS,
    GET_USERS_PENDING,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    UPDATE_USER_NAME_SUCCESS,
    UPDATE_USER_NAME_PENDING,
    UPDATE_USER_NAME_ERROR,
    DELETE_USER_SUCCESS,
    INVITE_USER_SUCCESS,
    DELETE_USER_ERROR,
    OPEN_NAME_EDIT,
    CLOSE_NAME_EDIT
} from '../actions/types';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import findIndex from 'lodash/findIndex';

const defaultState = {
    pending: false,
    success: false,
    error: false,
    nameEditIsOpen: false,
    value: []
};

const usersReducer = (state = defaultState, action) => {
    let index;
    let user;
    let newState;
    switch (action.type) {
        case UPDATE_USER_NAME_PENDING:
        case GET_USERS_PENDING:
            return {
                ...state,
                pending: true
            };
        case GET_USERS_SUCCESS:
            return {
                ...state,
                pending: false,
                success: true,
                value: action.payload
            };
        case UPDATE_USER_NAME_SUCCESS:
            return {
                ...state,
                pending: false,
                success: true
            };
        case UPDATE_USER_SUCCESS:
            user = action.payload;
            index = findIndex(state.value, u => u._id === user._id);
            newState = cloneDeep(state);
            newState.value[index] = merge(newState.value[index], user);
            return newState;
        case INVITE_USER_SUCCESS:
            user = action.payload;
            return {
                ...state,
                value: [...state.value, user]
            };
        case DELETE_USER_SUCCESS:
            user = action.payload;
            return {
                ...state,
                value: state.value.filter(u => u._id !== user._id)
            };
        case GET_USERS_ERROR:
        case UPDATE_USER_ERROR:
        case UPDATE_USER_NAME_ERROR:
        case DELETE_USER_ERROR:
            return {
                ...state,
                pending: false,
                error: action.payload
            };
        case OPEN_NAME_EDIT:
            return {
                ...state,
                nameEditIsOpen: true
            };
        case CLOSE_NAME_EDIT:
            return {
                ...state,
                nameEditIsOpen: false
            };
        default:
            return state;
    }
};

export default usersReducer;
