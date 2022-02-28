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

//comments

export const GET_COMMENTS = "GET_COMMENTS";
export const ADD_COMMENT = "ADD_COMMENT";

// errors
export const GET_POST_ERRORS = "GET_POST_ERRORS";

export const getComments = () => {
  let tableau;
  return (dispatch) => {
    return axios
      .get(`${url_api}/api/comments/`, {withCredentials: true})
      .then((res) => {
        tableau = res.data;
        sortTab(tableau);
        const array = tableau.slice();
        dispatch({ type: GET_COMMENTS, payload: array });
      })
      .catch((err) => console.log(err));
  };
};

export const addComment = (postId, data) => {
  return (dispatch) => {
    return axios({
      method: "post",
      url: `${url_api}/api/comments/create/${postId}`,
      data: data,
      withCredentials: true 
    })
      .then((res) => dispatch({ type: GET_POST_ERRORS, payload: "" }))
      .catch((err) => console.log(err));
  };
};
