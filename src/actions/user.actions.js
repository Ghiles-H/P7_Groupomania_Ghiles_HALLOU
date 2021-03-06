import axios from "axios";
import { url_api } from "..";

export const GET_USER = "GET_USER";
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const UPDATE_BIO = "UPDATE_BIO";
export const DELETE_USER = "DELETE_USER";

export const getUser = (uid) => {
  return (dispatch) => {
    return axios
      .get(`${url_api}/api/users/getprofile/${uid.id}`, {withCredentials: true})
      .then((res) => {
        dispatch({ type: GET_USER, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

export const uploadPicture = (data, id) => {
  return (dispatch) => {
    return axios
      .post(`${url_api}/api/users/updateprofilImg/${id}`, data, {withCredentials: true})
      .then((res) => {
        console.log("res.data.imgUrl= ",res.data.imgUrl);
        dispatch({ type: UPLOAD_PICTURE, payload: res.data.imgUrl }); //Erreur possible sur le .picture => à remplacer par .imgUrl si besoin
        
      })
      .catch((err) => console.log(err));
  };
};

export const updateBio = (userId, bio) => {
  console.log("uid(updateBio)=", userId);
  console.log("bio=", bio);
  return (dispatch) => {
    return axios({
      method: "put",
      url: `${url_api}/api/users/updateprofil/${userId}`,
      data: { bio },
      withCredentials: true
    })
      .then((res) => {
        dispatch({ type: UPDATE_BIO, payload: bio });
      })
      .catch((err) => console.log(err));
  };
};

export const deleteUser = (userId) => {
  return (dispatch) =>{
    return axios({
      method: 'delete',
      url: `${url_api}/api/users/deleteprofil/${userId}`,
      data: {userId},
      withCredentials: true
    }).then((res) => {
      dispatch({type: DELETE_USER, payload: {userId}})
    })
  }
}