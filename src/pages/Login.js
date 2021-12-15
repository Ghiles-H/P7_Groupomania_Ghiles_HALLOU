import ResponsiveAppBar from "../components/Banner";
import SignIn from "../components/SignIn";
import "../styles/Login.css"

const Login = () => {
  return (
    <div className="Login">
      <div className="banner">
        <ResponsiveAppBar />
      </div>
      <SignIn></SignIn>
    </div>
  );
};

export default Login;
