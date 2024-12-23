// components/ProductList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AreaCard from "./AreaCard.jsx";
import Navbar from "./NavBar.jsx";
import "./SearchAreas.css"
import { useParams, useNavigate} from "react-router-dom";

const SearchAreas = () => {
  const {userId} = useParams();
  const navigate = useNavigate();
  const { search } = useParams();
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    fetchAreas();
  }, []);
  
  const fetchAreas = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user/${userId}/searchAreas?search=${search}`); // Replace with your API endpoint
      setAreas(response.data.areas);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };
  return (
    <div><Navbar key={userId} userId={userId} />
      <div className="product-list">
        {areas.map((area) => (
          <AreaCard key={area._id} area={area} userId={userId} navigate={navigate}/>
        ))}
      </div>
    </div>
  );
};

export default SearchAreas;