import React from "react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getComments, addComment } from "../../actions/comments.action";
import { dateParcer, isEmpty } from "../Utils";

const CardComment = (post) => {
  const [text, setText] = useState();
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const comments = useSelector((state) => state.commentReducer);
  const dispatch = useDispatch();

  const cancelComment = () => {
    setText("");
  };
  const handleComment = async (e) => {
    e.preventDefault();
    if (text) {
      let data = {
        content: text,
        userId: userData.id,
      };
      await dispatch(addComment(post.post.id, data));
      dispatch(getComments());
      cancelComment();
    } else {
      alert("Veuillez entrer un message ! ");
    }
  };

  return (
    <div className="comments-container">
      {!isEmpty(comments[0]) &&
      // eslint-disable-next-line
        comments.map((comment) => {
          if (post.post.id === comment.messageId) {
            return (
              <div
                className={
                  userData.id === comment.userId
                    ? "comment-container client"
                    : "comment-container"
                }
              >
                <div className="left">
                  <img
                    src={usersData
                      // eslint-disable-next-line
                      .map((user) => {
                        if (user.id === comment.userId) {
                          if(user.imgUrl !== null){
                            return user.imgUrl;
                          }else{
                            return "./img/random-user.png";
                          }
                        }
                      })
                      .join("")}
                    alt="user-pic"
                  />
                </div>
                <div className="right-part">
                  <div className="comment-header">
                    <div className="pseudo">
                      <h3>
                        {// eslint-disable-next-line
                        usersData.map((user) => {
                          if (comment.userId === user.id) {
                            return user.firstname;
                          }
                        })}
                      </h3>
                    </div>
                    <span>{dateParcer(comment.createdAt)}</span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            );
          }
        })}
      {userData.id && (
        <form action="" onSubmit={handleComment} className="comment-form">
          <input
            type="text"
            name="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Laisser un commentaire"
          />
          <br />
          <input type="submit" value="Envoyer" />
        </form>
      )}
    </div>
  );
};

export default CardComment;
