// Import
import ResponsiveAppBar from "../components/Banner";
import RecipeReviewCard from "../components/Posts";
import "../styles/HomePage.css";
// Components
function Home() {
  return (
    <div className="Home">
      <div className="banner">
        <ResponsiveAppBar />
      </div>
      <div className="noBannerPart">
        <div className="usersPart">
            <p>User 1</p>
            <p>User 2</p>
            <p>User 3</p>
            <p>User 4</p>
            <p>User 5</p>
        </div>
        <div className="postsPart">
          <RecipeReviewCard />
          <RecipeReviewCard />
        </div>
      </div>
    </div>
  );
}

export default Home;
