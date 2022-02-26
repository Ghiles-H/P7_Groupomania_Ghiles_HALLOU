import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { dateParcer, isEmpty } from "../Utils";
import DeleteCard from "./DeleteCard";
import LikeButtom from "./LikeButtom";
import CardComment from "./CardComment";
import { getComments } from "../../actions/comments.action";
import { useDispatch } from "react-redux";

const Card = ({ post }) => {
  const [isLoading, setIsLoading] = useState(false); //Ne pas oublier de mettre le state sur true.
  const [showComments, setShowComments] = useState(false);
  const dispatch = useDispatch();

  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);

  useEffect(() => {
    !isEmpty(usersData[0]) && setIsLoading(false);
  }, [usersData]);
  return (
    <li className="card-container" key={post.id}>
      {isLoading ? (
        <i className="fas fa-spinner fa-spin"></i>
      ) : (
        <>
          <div className="card-left">
            <img
              src={usersData // eslint-disable-next-line
                .map((user) => {
                  if (user.id === post.UserId && user.imgUrl !== null) {
                    return user.imgUrl;
                  } else {
                    if (user.id === post.UserId) {
                      return "./img/random-user.png";
                    }
                  }
                })
                .join("")}
              alt=""
            />
          </div>
          <div className="card-right">
            <div className="card-header">
              <div className="pseudo">
                <h3>
                  {!isEmpty(usersData[0]) &&  // eslint-disable-next-line
                    usersData.map((user) => {
                      if (user.id === post.UserId)
                        return user.firstname + " " + user.lastname;
                    })}
                  {/* {isEmpty(usersData[0]) && "NameUserPoster"} */}
                </h3>
              </div>
              <span>{dateParcer(post.createdAt) + " id= " + post.id}</span>
            </div>
            <p>{post.content}</p> {/* post.content */}
            
            {post.attachment ? (post.attachment.includes(".webp") || post.attachment.includes(".png") || post.attachment.includes(".jpg") || post.attachment.includes(".jpeg") ? (
              <img src={post.attachment} alt="card-pic" className="card-pic" />
              ) : (<video src={post.attachment} alt="card-gif" className="card-pic" />)) : null}
              
            {// eslint-disable-next-line
            (userData.id === post.UserId || userData.isModerator == true) && (
              <div className="button-container">
                <DeleteCard id={post.id} props={post} />
              </div>
            )}
            <div className="card-footer">
              <div className="comment-icon">
                <img
                  onClick={() => {
                    setShowComments(!showComments);
                    dispatch(getComments());
                  }}
                  src="./img/icons/message1.svg"
                  alt="comment-icon"
                />
                <span>{post.comments ? post.comments : "0"}</span>
              </div>

              <LikeButtom post={post} />
              <img src="./img/icons/share.svg" alt="share-icon" />
            </div>
            {showComments && <CardComment post={post}/>}
          </div>
        </>
      )}
    </li>
  );
};

export default Card;
