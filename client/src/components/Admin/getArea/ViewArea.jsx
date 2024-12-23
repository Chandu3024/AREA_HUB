import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ViewArea.css";
import Navbar from "../NavBar.jsx";

const ViewArea = () => {
  const { id } = useParams();
  const [Area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreaDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/adminArea/getAreaById/${id}`);
        setArea(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAreaDetails();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  // Extract Base64 or URL for image
  return (
    <div>
      <Navbar />
      <div className="view-area-container">
        <div className="area-card">
          <div className="area-image">
            <img src={Area.images && Area.images.length > 0 ? Area.images[Area.images.length-1] : "placeholder.jpg"} />
          </div>
          <div className="area-details">
            <h1 className="area-title">{Area.name || "No Name Available"}</h1>
            <div className="info-group">
              <p>
                <strong>City:</strong> {Area.city || "N/A"}
              </p>
              <p>
                <strong>State:</strong> {Area.state || "N/A"}
              </p>
              <p>
                <strong>Country:</strong> {Area.country || "N/A"}
              </p>
              <p>
                <strong>Postcode:</strong> {Area.postCode || "N/A"}
              </p>
              <p>
                <strong>Landmarks:</strong> {Area.landMark?.length > 0 ? Area.landMark.join(", ") : "None"}
              </p>
              <p>
                <strong>Tags:</strong> {Area.tags?.length > 0 ? Area.tags.join(", ") : "None"}
              </p>
              <p>
                <strong>Type:</strong> {Area.type || "N/A"}
              </p>
              <p>
                <strong>Rating:</strong> {Area.rate || 0}/10
              </p>
              <p>
                <strong>Reviews:</strong> {Area.review?.length > 0 ? Area.review.join(", ") : "No reviews available"}
              </p>

              {/* Crimes Section */}
              <div>
                <strong>Crimes:</strong>
                {Area.crimes && Area.crimes.length > 0 ? (
                  <ul>
                    {Area.crimes.map((crime, index) => (
                      <li key={index}>
                        <strong>Incident:</strong> {crime.incident || "N/A"} |{" "}
                        <strong>Review:</strong> {crime.review || "No review available"} |{" "}
                        <strong>Date:</strong>{" "}
                        {crime.reportedDate ? new Date(crime.reportedDate).toLocaleDateString() : "N/A"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No crimes reported</p>
                )}
              </div>

              {/* Grocery Section */}
              <div>
                <strong>Grocery:</strong>
                {Area.grocery && Area.grocery.length > 0 ? (
                  <ul>
                    {Area.grocery.map((item, index) => (
                      <li key={index}>
                        <strong>Product:</strong> {item.product || "N/A"} |{" "}
                        <strong>Quantity:</strong> {item.quantity || "N/A"} |{" "}
                        <strong>Price:</strong> ₹{item.price || "N/A"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No grocery items listed</p>
                )}
              </div>

              <p>
                <strong>Events:</strong> {Area.events?.length > 0 ? Area.events.join(", ") : "No events listed"}
              </p>
              <p>
                <strong>Tourist Attractions:</strong>{" "}
                {Area.tourPlaces?.length > 0 ? Area.tourPlaces.join(", ") : "No tourist attractions listed"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewArea;
