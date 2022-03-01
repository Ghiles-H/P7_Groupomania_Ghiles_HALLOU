import React from "react";
import { useSelector } from "react-redux";
import  LeftNav  from "../components/LeftNav";
import NewPostForm from "../components/Post/NewPostForm";
import Thread from "../components/Thread";
import Log from "../components/Log";

const Home = () => {
  const userData = useSelector((state) => state.userReducer);
  return (
    <div className="home">
      <LeftNav/>
      <div className="main">
        <div className="home-header">
          {userData.id ? <NewPostForm /> : <Log signin={true} signup={false} />} {/* Remplacer le 2e newpostform par <Redirect to="/profil" /> quand le project est fini */}
        </div>
        {userData.id ? <Thread/> : null }
        
      </div>
    </div>
  );
};

export default Home;
