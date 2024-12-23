import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Home.css"
import AreaCard from "./AreaCard.jsx"
import Navbar from "./NavBar.jsx";

const Home = () => {
  const {userId}  = useParams()
  const [history, setHistory] = useState([]);
  const [areas, setAll] = useState([]);
  const [interested, setInterested] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
    fetchHistory();
    fetchInterestedAreas();
  }, []);

  const fetchAll = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user/getAll`);
      setAll(response.data.areas);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };


  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user/getHistory/${userId}`);
      setHistory(response.data.areas);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const fetchInterestedAreas = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user/getInterested/${userId}`);
      setInterested(response.data.areas);
    } catch (error) {
      console.error("Error fetching interested areas:", error);
    }
  };

  return (
    <div><Navbar key={userId} userId={userId}/>
      <div className="home-container">
      <section>
          <h2>Featured Areas</h2>
          <div className="area-list">
            {areas.map((area) => (
              <AreaCard key={area._id} area={area} userId={userId} navigate={navigate} />
            ))}
          </div>
        </section>
        <section>
          <h2>Interested Areas</h2>
          <div className="area-list">
            {interested.map((area) => (
              <AreaCard key={area._id} area={area} userId={userId} navigate={navigate} />
            ))}
          </div>
        </section>
        <section>
          <h2>History</h2>
          <div className="area-list">
            {history.map((area) => (
              <AreaCard key={area._id} area={area} userId={userId} navigate={navigate} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );

};

export default Home;
