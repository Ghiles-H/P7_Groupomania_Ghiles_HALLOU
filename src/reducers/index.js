import { combineReducers } from "redux";
import userReducer from "./user.reducer";
import postReducer from "./post.reducer";
import usersReducer from "./users.reducer";
import commentReducer from "./comments.reducer"

export default combineReducers({
    usersReducer,
    userReducer,
    postReducer,
    commentReducer,
});