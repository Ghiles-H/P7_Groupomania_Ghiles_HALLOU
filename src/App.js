// Import
import { BrowserRouter } from "react-router-dom";
import ResponsiveAppBar from "./components/Banner";
import RecipeReviewCard from "./components/Posts";
import Home from "./pages/HomePage";
import "./styles/App.css";
// Components
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/HomePage" exact component={Home} />
          <Route path="/Profil" exact component={} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
