// Import
import React, { useEffect, useState } from "react";
import { UidContext } from "./components/AppContext";
import Routes from "./components/Routes";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.actions";
import { useSelector } from "react-redux";
import { url_api } from ".";

// Components
const App = () => {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();
  
  const userData = useSelector((state) => state.userReducer);

  useEffect(() => {
    const fetchToken = async () => {
      await axios({
        method: "get",
        url: `${url_api}/jwtid`,
        withCredentials: true,
      })
        .then((res) => {
          setUid(res.data);
          if (uid) {
            dispatch(getUser(uid));
          }
        })
        .catch((err) => console.log("req= ", err));
    };
    if (userData.id === undefined) {
      fetchToken();
    }
  
    
  }, [uid, dispatch, userData.id]);

  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
};

export default App;
