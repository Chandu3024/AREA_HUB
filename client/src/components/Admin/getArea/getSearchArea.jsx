import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import Navbar from "../NavBar.jsx";

const AreaSearch = () => {
  const { searchs } = useParams();
  const search = decodeURIComponent(searchs);
  const [Areas, setAreas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/adminArea/getSearch/${search}`);
        setAreas(response.data.area);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch area data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search]); // Update useEffect to run when `search` changes

  const deleteArea = async (AreaId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/adminArea/deleteAreaById/${AreaId}`);
      setAreas((prevArea) => prevArea.filter((Area) => Area._id !== AreaId));
      toast.success(response.data.msg, { position: "top-right" });
    } catch (error) {
      console.error("Error deleting area:", error);
      toast.error("Failed to delete the area.", { position: "top-right" });
    }
  };

  if (loading) return <p>Loading...</p>;

  if (error)
    return (
      <div>
        <Navbar />
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className="AreaTable">
        {Areas.length === 0 ? (
          <p>No areas found for the search: {search}</p>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default AreaSearch;
