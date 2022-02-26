import axios from "axios";
import { url_api } from "..";

const sortTab = (tab) => {
  const sortKey = 1;
  tab.sort(function compare(a, b) {
    if (a.createdAt < b.createdAt) return sortKey;
    if (a.createdAt > b.createdAt) return -sortKey;
    return 0;
  });
};
//posts

export const GET_POSTS = "GET_POSTS";
export const ADD_POST = "ADD_POST";
export const LIKE_POST = "LIKE_POST";
export const UNLIKE_POST = "UNLIKE_POST";
export const DELETE_POST = "DELETE_POST";
export const GET_GAG = "GET_GAG";

// errors
export const GET_POST_ERRORS = "GET_POST_ERRORS";

export const getPosts = (num) => {
  let tableau;
  return (dispatch) => {
    return axios
      .get(`${url_api}/api/messages/`)
      .then((res) => {
        tableau = res.data;
        sortTab(tableau);
        const array = tableau.slice(0, num);

        dispatch({ type: GET_POSTS, payload: array });
      })
      .catch((err) => console.log(err));
  };
};

export const addPost = (data) => {
  return (dispatch) => {
    return axios
      .post(`${url_api}/api/messages/create/`, data)
      .then((res) => dispatch({ type: GET_POST_ERRORS, payload: "" }))
      .catch((err) => console.log(err));
  };
};

export const addGag = (imgLink) => {
  let imgGagLink;
  const axi = axios
    .get(`${url_api}/puppeteer/${imgLink}`)
    .then((res) => {
      imgGagLink = res.data;
      console.log(imgGagLink);
      return imgGagLink;
    })
    .catch((err) => console.log(err));

  return imgGagLink;
};

export const likePost = (messageId, userId) => {
  return (dispatch) => {
    return axios({
      method: "post",
      url: `${url_api}/api/messages/vote/like/` + messageId,
      data: { id: userId },
    })
      .then((res) => {
        dispatch({ type: LIKE_POST, payload: { messageId, userId } });
      })
      .catch((err) => console.log(err));
  };
};
export const unlikePost = (messageId, userId) => {
  return (dispatch) => {
    return axios({
      method: "post",
      url: `${url_api}/api/messages/vote/unlike/` + messageId,
      data: { id: userId },
    })
      .then((res) =>
        dispatch({ type: UNLIKE_POST, payload: { messageId, userId } })
      )
      .catch((err) => console.log(err));
  };
};

export const deletePost = (messageId, userId) => {
  return (dispatch) => {
    console.log("msg=", messageId);
    console.log("user=", userId);
    return axios({
      method: "delete",
      url: `${url_api}/api/messages/delete/${messageId}`,
      data: { userId },
    }).then((res) => {
      dispatch({ type: DELETE_POST, payload: { messageId } });
    });
  };
};
