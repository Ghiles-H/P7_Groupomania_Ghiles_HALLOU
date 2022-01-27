// Import
import React, {useState, useEffect, Fragment} from 'react';
import ResponsiveAppBar from "../components/Banner";
import RecipeReviewCard from "../components/Posts";
import "../styles/HomePage.css";
import axios from "axios";
// Components
const urlApi = "http://localhost:8080/api/messages"
function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        urlApi,
      );
      setData(result.data)
    };
    fetchData();
  }, [])
  //let dataOrigin = data;
  //console.log("dataOrigin", dataOrigin);
  data.sort(function compare(a, b) {
    if (a.id < b.id)
       return -1;
    if (a.id > b.id )
       return 1;
    return 0;
  });
  //console.log("dataSort", data);

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
          
          {data.length > 1 && <RecipeReviewCard props={data[1]}/>}
        </div>
      </div>
    </div>
  );
}

export default Home;
