//Imports
import React, { useContext } from "react";
import Log from "../components/Log";
import { UidContext } from "../components/AppContext";
import UpdateProfil from "../components/profil/UpdateProfil";
import LeftNav from "../components/LeftNav";

const Profil = () => {

  const uid = useContext(UidContext);
  return (
    <div className="profil-page">
      {uid ? (
        <><LeftNav />
        <UpdateProfil/></>
      ) : (
        <div className="log-container">
          <Log signin={false} signup={true} />  {/* decalage du texte des input dans _connectionForm.scss input["text/password"] */}
          <div className="img-container">
            <img src="./img/log.svg" alt="img-log" />
          </div>
        </div>
      )}
    </div>


  );
};

export default Profil;
