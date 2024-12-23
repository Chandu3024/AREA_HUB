import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./getAllArea.css";
import { Link } from "react-router-dom";
import Navbar from "../NavBar.jsx";

const Area = () => {
  const [Areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:8000/adminArea/getall");
      setAreas(response.data);
    };

    fetchData();
  }, []);

  const deleteArea = async (AreaId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this area?");
    
    if (isConfirmed) {
      try {
        const response = await axios.delete(`http://localhost:8000/adminArea/deleteAreaById/${AreaId}`);
        setAreas((prevArea) => prevArea.filter((Area) => Area._id !== AreaId));
        toast.success(response.data.msg, { position: "top-right" });
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete area. Please try again.");
      }
    } else {
      toast.error("Deletion canceled", { position: "top-right" });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="AreaTable">
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Area Name</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Areas.map((Area, index) => (
              <tr key={Area._id}>
                <td>{index + 1}</td>
                <td>{Area.name}</td>
                <td>{Area.city}</td>
                <td>{Area.state}</td>
                <td>{Area.country}</td>
                <td className="actionButtons">
                  <button onClick={() => deleteArea(Area._id)} id="del">
                    <i className="fa-solid fa-trash"></i> Delete
                  </button>
                  <Link to={`/edit/${Area._id}`}>
                    <button className="buttonedit">
                      <i className="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                  </Link>
                  <Link to={`/view/${Area._id}`}>
                    <button className="buttonview">
                      <i className="fa-solid fa-eye"></i> View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Area;
