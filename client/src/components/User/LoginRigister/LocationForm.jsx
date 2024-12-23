import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './LocationForm.css'
const LocationForm = () => {
    const {userId} = useParams();
  const [formData, setFormData] = useState({
    country: "",
    area: "",
    city: "",
    tags: [],
  });
  const navigate = useNavigate();
  const availableTags = [
    "historic",
    "nature",
    "heritages",
    "culture",
    "adventure",
    "temple",
    "popular",
    "monastery",
    "national park",
    "hill",
    "beach",
    "waterfall",
    "lake",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagSelection = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag) // Remove if already selected
        : [...prev.tags, tag], // Add if not selected
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/userHome/id:${userId}`)
  };

  return (
    <div className="location-form-container">
    <h3>Enter Location Details</h3>
    <form onSubmit={handleSubmit}>
        <div>
        <label>
            Country:
            <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter country"
            required
            />
        </label>
        </div>
        <div>
        <label>
            Area:
            <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="Enter area"
            required
            />
        </label>
        </div>
        <div>
        <label>
            City:
            <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
            required
            />
        </label>
        </div>
        <div>
        <label>
            Select Tags:
            <div className="tag-container">
            {availableTags.map((tag) => (
                <div
                key={tag}
                className={`tag ${formData.tags.includes(tag) ? "selected" : ""}`}
                onClick={() => handleTagSelection(tag)}
                >
                {tag}
                </div>
            ))}
            </div>
        </label>
        </div>
        <button type="submit">Submit</button>
    </form>
    </div>
  );
};

export default LocationForm;
