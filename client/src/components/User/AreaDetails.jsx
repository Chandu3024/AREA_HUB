import React, { useState, useEffect } from "react";
import Navbar from "./NavBar.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import GetStarRating from "./Rate"
import { useNavigate } from "react-router-dom";
import AreaCard from "./AreaCard.jsx"
import "./AreaDetails.css";

const AreaDetails = () => {
  const [history, setHistory] = useState([]);
  const [related, setRelated] = useState([]);
  const { userId, id } = useParams();
  const navigate = useNavigate();
  const [area, setArea] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [rating, setRating] = useState(0); // User's rating
  const [isFavorited, setIsFavorited] = useState(false);
  const [newReview, setNewReview] = useState(""); // New review text
  const [reviews, setReviews] = useState([]); // List of reviews

  useEffect(() => {
    addHistory();
    fetchAreaDetails();
    fetchHistory();
  }, [id]);

  const addHistory = async()=>{
    try {
      await axios.post(`http://localhost:8000/user/addHistory/${userId}/${id}`)
    }catch(error){
      console.error(error)
    }
  }
  const fetchAreaDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/adminArea/getAreaById/${id}`);
      setArea(response.data);
      setSelectedImage(response.data.images[0] || "/placeholder.jpg");
      setReviews(response.data.review || []);
      checkIfFavorited();
      fetchRelated();
    } catch (error) {
      console.error("Error fetching area details:", error);
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
  const fetchRelated = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/user/related/${id}`);
      setRelated(response.data.areas);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };
  
  const checkIfFavorited = async () => {
    try {
      const response = await axios.get(`/getFav/${userId}/${id}`);
      setIsFavorited(response.data.exists);
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  };

  const handleAddFav = async () => {
    try {
      await axios.post(`/addFav/${userId}/${id}`);
      setIsFavorited(true);
      alert("Added to favorites");
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const handleRemoveFav = async () => {
    try {
      await axios.delete(`/removeFav/${userId}/${id}`);
      setIsFavorited(false);
      alert("Removed from favorites");
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleRating = async (newRating) => {
    try {
      setRating(newRating);
      await axios.post(`/rateArea/${id}`, { userId, rating: newRating });
      alert("Rating submitted");
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleAddReview = async () => {
    try {
      await axios.post(`/addReview/${id}`, { userId, review: newReview });
      setReviews((prevReviews) => [...prevReviews, newReview]);
      setNewReview("");
      alert("Review added");
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  if (!area) return <div>Loading...</div>;

  return (
    <div><Navbar  key={userId} userId={userId}/>
      <div className="area-details-container">
        <div className="area-header">
          <div className="main-image">
            <img src={area.images && area.images.length > 0 ? area.images[area.images.length-1] : "/images/placeholder.wepb"} alt={area.city} />
          </div>
          <h2>{area.name}</h2>
          <h3>{area.city}, {area.state}</h3>
          <p>{area.country}</p>
          <div className="rating">
          Rating: {<GetStarRating rating={area.rate}/>}
          </div>
        </div>

        <div className="area-gallery">
          {area.images.map((image, index) => (
            <div key={index} className="thumbnail-container">
              <img
                src={image}
                alt={`thumbnail-${index}`}
                className="thumbnail"
                onClick={() => handleImageClick(image)}
              />
            </div>
          ))}
        </div>

        <div className="area-info">
          <h3>Type: {area.type}</h3>
          <p>{area.description}</p>
          <h4>Tags:</h4>
          <ul>
            {area.tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>

        <div className="area-reviews">
          <h4>Reviews:</h4>
          {reviews.length > 0 ? (
            reviews.map((review, index) => <p key={index}>- {review}</p>)
          ) : (
            <p>No reviews yet.</p>
          )}
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write a review..."
          />
          <button onClick={handleAddReview}>Submit Review</button>
        </div>

        <div className="rating-container">
          <h4>Rate this Area:</h4>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? "selected" : ""}`}
              onClick={() => handleRating(star)}
            >
              ★
            </span>
          ))}
        </div>

        <div className="area-crime">
        <h4>Reported Crimes:</h4>
        {area.crimes.length > 0 ? (
          <div className="crime-list">
            {area.crimes.map((crime, index) => (
              <div key={index} className="crime-card">
                <img
                  src="/images/crime-icon.jpeg" // Replace with relevant icons
                  alt="Crime Icon"
                  className="crime-icon"
                />
                <div>
                  <h5>{crime.incident}</h5>
                  <p>{crime.review}</p>
                  <span>{new Date(crime.reportedDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No reported crimes in this area.</p>
        )}
      </div>

      <div className="area-grocery">
    <h4>Grocery Items:</h4>
    {area.grocery.length > 0 ? (
      <div className="grocery-list">
        {area.grocery.map((item, index) => (
          <div key={index} className="grocery-card">
            <img
              src={`/images/grocery.jpeg`}
              alt={item.category || "Grocery Item"}
              className="grocery-card-icon"
            />
            <div className="grocery-card-content">
              <h5>{item.product}</h5>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> ${item.price}</p>
              <span className={`badge ${item.category || "default"}`}>
                {item.category || "General"}
              </span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>No grocery items listed.</p>
    )}
  </div>


      <div className="area-events">
        <h4>Events:</h4>
        {area.events.length > 0 ? (
          <div className="events-list">
            {area.events.map((event, index) => (
              <div key={index} className="event-card">
                <div className="event-info">
                  <h5>{event}</h5>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No events available.</p>
        )}
      </div>

      <div className="area-tour-places">
        <h4>Tourist Places:</h4>
        {area.tourPlaces.length > 0 ? (
          <div className="tour-places-list">
            {area.tourPlaces.map((place, index) => (
              <div key={index} className="tour-card">
                <img
                  src={"/images/tour.jpeg"}
                  alt={place.name}
                  className="tour-image"
                />
                <div>
                  <h5>{place}</h5>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tourist places available.</p>
        )}
      </div>

        <button
          className={`fav-btn ${isFavorited ? "favorited" : ""}`}
          onClick={isFavorited ? handleRemoveFav : handleAddFav}
        >
          {isFavorited ? "♥ Remove from Favorites" : "♡ Add to Favorites"}
        </button>
      </div>
        <div>
          <section>
            <h2>History</h2>
            <div className="area-list">
              {history.map((area) => (
                <AreaCard key={area._id} area={area} userId={userId} navigate={navigate} />
              ))}
            </div>
          </section>

          <section>
            <h2>Related Areas</h2>
            <div className="area-list">
              {related.map((area) => (
                <AreaCard key={area._id} area={area} userId={userId} navigate={navigate} />
              ))}
            </div>
          </section>
        </div>
    </div>
  );
};

export default AreaDetails;
