import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { deletePost } from "../../actions/post.actions";

const DeleteCard = (props) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.userReducer);
  const deleteQuote = () => {
      dispatch(deletePost(props.id, userData.id))
  };
  return (
    <div
      onClick={() => {
        if (window.confirm("Voulez-vous supprimer ce message ?")) {
          deleteQuote();
        }
      }}
    ><img src="./img/icons/trash.svg" alt="trash" /></div>
  );
};

export default DeleteCard;
