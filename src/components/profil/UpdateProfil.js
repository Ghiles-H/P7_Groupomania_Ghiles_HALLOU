import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import UploadImg from "./UploadImg";
import { updateBio, deleteUser } from "../../actions/user.actions";
import { dateParcer } from "../Utils";
import { Redirect } from "react-router-dom";

const UpdateProfil = () => {
  const [bio, setBio] = useState("");
  const [updateForm, setUpdateForm] = useState(false);
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  
  const handleUpdate = () => {
    dispatch(updateBio(userData.id, bio));
    setUpdateForm(false);
  };
  
  const handleDelete = () => {
    if(window.confirm('Voulez-vous vraiment supprimer votre compte ?')){
      dispatch(deleteUser(userData.id));
      window.location.replace('http://localhost:3000/profil');
    }
  }
  return (
    <div className="profil-container">
      <h1>
        Profil de{" "}
        {userData.firstname !== undefined ? userData.firstname : "Generic Name"}
      </h1>
      <div className="update-container">
        <div className="left-part">
          <h3>Photo de profil</h3>
          <img src={userData.imgUrl !== null ? userData.imgUrl : "./img/random-user.png"} alt="user-img" />
          <UploadImg />
        </div>
        <div className="right-part">
          <div className="bio-update">
            <h3>Bio</h3>
            {updateForm === false && (
              <>
                <p onClick={() => setUpdateForm(!updateForm)}>{userData.bio}</p>
                <button onClick={() => setUpdateForm(!updateForm)}>
                  Modifier bio
                </button>
              </>
            )}
            {updateForm && (
              <>
                <textarea
                  type="text"
                  defaultValue={userData.bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
                <button onClick={handleUpdate}>Valider modifications</button>
              </>
            )}
          </div>
          <h4>Membre depuis le : {dateParcer(userData.createdAt)}</h4>
          <h5 onClick={handleDelete}>Supprimer son compte</h5>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfil;
