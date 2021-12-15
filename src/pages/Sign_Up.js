import SignUp from "../components/SignUp";
import ResponsiveAppBar from "../components/Banner";
import "../styles/Sign_Up.css"
const Sign_Up = () => {
  return (
    <div className="Sign_Up">
      <div className="banner">
        <ResponsiveAppBar />
      </div>
      <SignUp></SignUp>
    </div>
  );
};

export default Sign_Up;
