import {
  DELETE_POST,
  GET_POSTS,
  LIKE_POST,
  UNLIKE_POST,
} from "../actions/post.actions";

const initialState = {};


let tabLikerPost;
let tabUnlikerPost;

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return action.payload;
    case LIKE_POST:
      return state.map((message) => {
        if (message.id === action.payload.messageId) {
          return {
            ...message,
            likes: message.likes + 1,
            Users: [{ id: action.payload.userId }, ...message.Users],
          };
        }
        return message;
      });
    case UNLIKE_POST:
      return state.map((message) => {
        if (message.id === action.payload.messageId) {
          tabUnlikerPost = message.Users.filter(// eslint-disable-next-line
            (user) => user.id == action.payload.userId
          );
          console.log("Unliker", tabUnlikerPost);
          tabLikerPost = message.Users.filter(
            (user) => user.id !== action.payload.userId
          );
          console.log("Liker", tabLikerPost);
          return {
            ...message,
            likes: message.likes - 1,
            Users: tabLikerPost,
          };
        }
        return message;
      });
    case DELETE_POST:
      return state.filter((message) => message.id !== action.payload.messageId);

    default:
      return state;
  }
}
