import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { UidContext } from "./AppContext";
import Logout from "./Log/logout";
const Navbar = () => {
  const uid = useContext(UidContext);
  const userData = useSelector((state) => state.userReducer);
    return (
    
    <nav>
      <div className="nav-container">
        <div className="logo">
          <NavLink exact to="/">
            <div className="logo">
              <img src="./groupomania_assets/icon-left-font-monochrome-black.png" alt="icon" />
              {/* <h3>Groupomania</h3> */}
            </div>
          </NavLink>
        </div>
        {uid ? (
            <ul>
                <li></li>
                <li className="welcome">
                    <NavLink exact to='/profil'>
                        <h5>Bienvenu {userData.firstname}</h5>
                    </NavLink>
                </li>
                <Logout />
            </ul>
        ) : (
            <ul>
                <li></li>
                <li>
                    <NavLink exact to='/profil'>
                        <img src='./img/icons/login.svg' alt='login' />
                    </NavLink>
                </li>
            </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
