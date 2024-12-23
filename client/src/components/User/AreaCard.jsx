import React, {useEffect} from "react";
import GetStarRating from "./Rate";

const AreaCard = ({ area, userId, navigate }) => {
  const handleClick = () => {
    navigate(`/area/${userId}/${area._id}`)
    window.location.reload();
  };
  return(
    <div className="area-card" key={area._id} onClick={() => {
      handleClick();
      }}>
      <div className="card-image">
        {/* Check if area.images exists and has at least one image */}
        <img
          src={area.images && area.images.length > 0 ? area.images[area.images.length-1] : "/images/placeholder.wepb"}
          alt={area.name}
        />
      </div>
      <div className="card-details">
        <h3>{area.name}</h3>
        <p>City: {area.city}</p>
        <p>State: {area.state}</p>
        <p>Country: {area.country}</p>
        <div className="rating">
        Rating: {<GetStarRating rating={area.rate}/>}
        </div>
      </div>
    </div>
)};


export default AreaCard;




