import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
import { useDispatch } from "react-redux";
import { isEmpty } from "../Utils";
import { likePost, unlikePost } from "../../actions/post.actions";

const LikeButtom = (post) => {
  const [liked, setLiked] = useState(false);
  const uid = useContext(UidContext);
  const dispatch = useDispatch();

  const like = () => {
    dispatch(likePost(post.post.id, uid.id));
    setLiked(true);
  };

  const unlike = () => {
    dispatch(unlikePost(post.post.id, uid.id));
    setLiked(false);
  };

  useEffect(() => {
    if (!isEmpty(post.post.Users[0]) && uid) {
      const usersIdLiked = post.post.Users.map((el) => el.id);  // eslint-disable-next-line
      if (usersIdLiked.includes(uid.id) == true) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    } else {
      setLiked(false);
    }
  }, [uid, post, liked]);

  return (
    <div>
      <div className="like-container">
        {uid && liked === false && (
          <img src="./img/icons/heart.svg" onClick={like} alt="like-icon-off" />
        )}
        {uid && liked === true && (
          <img
            src="./img/icons/heart-filled.svg"
            onClick={unlike}
            alt="like-icon-on"
          />
        )}
       {uid && (<span>{(post.post.likes)}</span>)} 
      </div>
    </div>
  );
};

export default LikeButtom;
