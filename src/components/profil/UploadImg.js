import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { uploadPicture } from "../../actions/user.actions";

const UploadImg = () => {
  const [file, setFile] = useState();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userReducer);
  const handlePicture = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('image', file);
    
    dispatch(uploadPicture(data, userData.id));
    

  };

  return (
    <form action="" onSubmit={handlePicture} className="upload-pic">
      <label htmlFor="file">Changer d'image</label>
      <input
        type="file"
        id="file"
        name="file"
        accept=".jpg, .jpeg, .png"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br />
      <input type="submit" value="Envoyer" />
    </form>
  );
};

export default UploadImg;
