import ResponsiveAppBar from "../components/Banner";
import "../styles/ProfilPage.css";
import profilDefaultImage from "../assets/images/profil_img/defaultProfil_Img.jpg";
import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

export function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);

  return (
    <Box >
      <BottomNavigation className="bottom-menu"
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Mes posts" className="bottom-menu-item"/>
        <BottomNavigationAction label="Mes commantaires" className="bottom-menu-item"/>
        <BottomNavigationAction label="Mes likes" className="bottom-menu-item"/>
      </BottomNavigation>
    </Box>
  );
}

const info = {
  firstName: "Default",
  lastName: "Name",
  srcImg: {profilDefaultImage},
  city: "Paris",
  job: "MyJob",
};

const personalInfo = () => {
  return (
    <div className="personalInfo">
      <img src={profilDefaultImage} alt="profil_image" className="personalInfo-img" />
      <div className="personalInfo-block">
        <h2 className="personalInfo-name">
          {info.firstName} {info.lastName}
        </h2>
        <p>Ville : {info.city}</p>
        <p>Poste : {info.job}</p>
      </div>
    </div>
  );
};


const Profil = () => {
  return (
    <div className="profil">
      <ResponsiveAppBar />
      <h1>Profil</h1>
      <br />
      {personalInfo()}
      {SimpleBottomNavigation()}
    </div>
  );
};

export default Profil;
