import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, timestampParser } from "../Utils";
import { NavLink } from "react-router-dom";
import { getPosts, addPost, addGag } from "../../actions/post.actions";
import axios from "axios";
import { url_api } from "../..";

const NewPostForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gagImg, setGagImg] = useState(null);
  const [message, setMessage] = useState("");
  let videoOk = false;
  const [postPicture, setPostPicture] = useState(null);
  const [video, setVideo] = useState("");
  const [file, setFile] = useState();
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  /*  content: message,
  userId: userData.id, */

  const handlePost = async () => {
    if (message || postPicture) {
      const data = new FormData();
      data.append("content", message);
      data.append("userId", userData.id);
      if (gagImg !== null) data.append("imgURL", gagImg);
      if (file) data.append("image", file);

      await dispatch(addPost(data));
      dispatch(getPosts());
      cancelPost();
    } else {
      alert("Veuillez entrer un message ou une image !");
    }
  };


  const handleMessage = async (e) => {
    const gagImgEx = "_700bwp.webp";
    const gagGifEx = ["_460svav1.mp4", "_460svh265.mp4"];

    let findLink = e.target.value.split(" ");
    console.log("FL", findLink);
    for (let i = 0; i < findLink.length; i++) {
      if (findLink[i].includes("https://9gag.com")) {



        let gagLinkId = findLink[i].split("/")[4];
        let gagLinkImg = await addGag(gagLinkId);
        await console.log(gagLinkImg);
        setGagImg(gagLinkImg);
        setPostPicture(gagLinkImg);

        /* if (window.confirm("C'est une image ou un gif/video ?")) {
          let gagLinkImg =
            "https://img-9gag-fun.9cache.com/photo/" + gagLink[4] + gagImgEx;
          console.log(gagLinkImg);
          setGagImg(gagLinkImg);
          setPostPicture(gagLinkImg);
        } else {
          let i = 0;
          while (videoOk !== true) {
            let gagLinkImg =
              "https://img-9gag-fun.9cache.com/photo/" +
              gagLink[4] +
              gagGifEx[i];
            setGagImg(gagLinkImg);
            setVideo(gagLinkImg);
            if (window.confirm("Votre video/gif s'affiche correctement ?")) {
            videoOk = true;
            }else{
              i++;
            }
          }
          
        } */
        findLink.splice(i, 1);
        findLink.push(" (Source: 9Gag.com)");
      }
    }
    setMessage(findLink.join(" "));
  };

  const handlePicture = (e) => {
    setPostPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
    setVideo("");
  };

  const cancelPost = () => {
    setMessage("");
    setPostPicture("");
    setVideo("");
    setGagImg("");
    setFile("");
  };
  useEffect(() => {
    if (!isEmpty(userData)) setIsLoading(false);
  }, [userData, message]);

  return (
    <div className="post-container">
      {isLoading ? (
        <i className="fas fa-spinner fa-pulse"></i>
      ) : (
        <>
          <div className="data">
            <p>
              <span>{userData.following ? userData.following.length : 0}</span>{" "}
              Abonnement
              {userData.following && userData.following.length > 1 ? "s" : null}
            </p>
            <p>
              <span>{userData.followers ? userData.followers.length : 0}</span>{" "}
              Abonné
              {userData.followers && userData.followers.length > 1 ? "s" : null}
            </p>
          </div>
          <NavLink exact to="/profil">
            <div className="user-info">
              <img
                src={
                  userData.imgUrl ? userData.imgUrl : "./img/random-user.png"
                }
                alt="user-img"
              />
            </div>
          </NavLink>
          <div className="post-form">
            <textarea
              name="message"
              id="message"
              placeholder="Quoi de neuf ?"
              onChange={(e) => handleMessage(e)}
              value={message}
            />
            {message || postPicture || video.length > 20 ? (
              <li className="card-container">
                <div className="card-left">
                  <img
                    src={
                      userData.imgUrl
                        ? userData.imgUrl
                        : "./img/random-user.png"
                    }
                    alt="user-img"
                  />
                </div>
                <div className="card-right">
                  <div className="card-header">
                    <div className="pseudo">
                      <h3>{userData.firstname + " " + userData.lastname}</h3>
                    </div>
                    <span>{timestampParser(Date.now())}</span>
                  </div>
                  <div className="content">
                    {message ? <p>{message}</p> : null}
                    {postPicture ? (
                      <img src={postPicture} alt="postPicture" />
                    ) : null}
                    {video ? <video src={video} alt="postVideo" /> : null}
                  </div>
                </div>
              </li>
            ) : null}
            <div className="footer-form">
              <div className="icon">
                {isEmpty(video) && (
                  <>
                    <img src="./img/icons/picture.svg" alt="img-import" />
                    <input
                      type="file"
                      id="file-upload"
                      name="file"
                      accept=".jpg, .jpeg, .png"
                      onChange={(e) => handlePicture(e)}
                    />
                  </>
                )}
                {video && (
                  <button onClick={() => setVideo("")}>Supprimer video</button>
                )}
              </div>
              <div className="btn-send">
                {message || postPicture || video.length > 20 ? (
                  <button className="cancel" onClick={cancelPost}>
                    Annuler message
                  </button>
                ) : null}
                <button className="send" onClick={handlePost}>
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NewPostForm;
