// Import
import  NotFound  from "./pages/NotFound";
import { BrowserRouter, Switch, Route } from "react-router-dom";
//import ResponsiveAppBar from "./components/Banner";
//import RecipeReviewCard from "./components/Posts";
import Home from "./pages/HomePage";
import Profil from "./pages/ProfilPage";
import "./styles/App.css";
// Components
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/home" exact component={ Home } />
          <Route path="/profil" exact component={Profil} />
          <Route  component={NotFound} />
          </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
