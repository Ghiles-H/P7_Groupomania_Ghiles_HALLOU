import axios from "axios";
import { url_api } from "..";
export const GET_USERS = "GET_USERS";

export const getUsers = () => {
  return (dispatch) => {
    return axios
      .get(`${url_api}/api/users`)
      .then((res) => {
        dispatch({ type: GET_USERS, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};
