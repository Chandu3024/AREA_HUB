import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Add.css";
import Navbar from "../NavBar.jsx";

const Add = () => {
  const initialArea = {
    name: "",
    city: "",
    state: "",
    country: "",
    postCode: "",
    landMark: [],
    tags: [],
    type: "",
    rate: 0,
    review: [],
    crimes: [],
    grocery: [],
    events: [],
    tourPlaces: [],
    images: [],
  };

  const [area, setArea] = useState(initialArea);
  const [crimes, setCrimes] = useState( [
    {
      incident: "",
      review : "",
      reportedDate:null
    }
  ] );
  const [grocery, setGrocery] = useState([
    {
      producr : "",
      quantity : null,
      price : null
    }
  ]);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setArea({ ...area, [name]: value });
  };

  const addToArray = (field, value) => {
    setArea((prevArea) => ({
      ...prevArea,
      [field]: [...prevArea[field], value],
    }));
  };
  
  const removeFromArray = (field, index) => {
    setArea((prevArea) => ({
      ...prevArea,
      [field]: prevArea[field].filter((_, i) => i !== index),
    }));
  };
  

  const handleCrimeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCrimes = [...crimes];
    updatedCrimes[index][name] = value;
    setCrimes(updatedCrimes);
  };

  const addCrime = () => setCrimes([...crimes, { incident: "", review: "" }]);

  const removeCrime = (index) => setCrimes(crimes.filter((_, i) => i !== index));

  const handleGroceryChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGrocery = [...grocery];
    updatedGrocery[index][name] = value;
    setGrocery(updatedGrocery);
  };

  const addGrocery = () => setGrocery([...grocery, { product: "", quantity: 0, price: 0 }]);

  const removeGrocery = (index) => setGrocery(grocery.filter((_, i) => i !== index));

  const submitForm = async (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();

    // Append basic string fields
    formData.append("name", area.name);
    formData.append("city", area.city);
    formData.append("state", area.state);
    formData.append("country", area.country);
    formData.append("postCode", area.postCode);
    formData.append("landMark", JSON.stringify(area.landMark)); // Convert array to JSON string
    formData.append("tags", JSON.stringify(area.tags)); // Convert array to JSON string
    formData.append("type", area.type);
    formData.append("rate", area.rate);
    formData.append("events", JSON.stringify(area.events)); // Convert array to JSON string
    formData.append("tourPlaces", JSON.stringify(area.tourPlaces)); // Convert array to JSON string

    // Append complex objects as JSON strings
    formData.append("crimes", JSON.stringify(crimes));
    formData.append("grocery", JSON.stringify(grocery));
    formData.append("review", JSON.stringify(area.review));

    // Append image file (if provided)
    if (area.images) {
      formData.append("images", area.images);
    }

    try {
      const response = await axios.post(`http://localhost:8000/adminArea/addArea`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.msg, { position: "top-right" });
      navigate("/getAll");
    } catch (error) {
      console.error(error);
      toast.error(error.response ? error.response.data.error : "Something went wrong", { position: "top-right" });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="add-area-container">
        <div className="form-wrapper">
          <div className="form-header">
            <h3>Add New Area</h3>
          </div>
          <form onSubmit={submitForm}>
            {/* Area Details */}
            <div className="form-group">
              <label htmlFor="AreaName">Area Name</label>
              <input
                type="text"
                onChange={inputHandler}
                id="AreaName"
                name="name"
                placeholder="Enter Area Name"
              />
            </div>

            {/* Other Fields */}
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                onChange={inputHandler}
                id="city"
                name="city"
                placeholder="Enter City"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <input
                type="text"
                onChange={inputHandler}
                id="state"
                name="state"
                placeholder="Enter State"
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input
                type="text"
                onChange={inputHandler}
                id="country"
                name="country"
                placeholder="Enter Country"
              />
            </div>

            <div className="form-group">
              <label htmlFor="postCode">PostCode</label>
              <input
                type="number"
                onChange={inputHandler}
                id="postCode"
                name="postCode"
                placeholder="Enter PostCode"
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <input
                type="text"
                onChange={inputHandler}
                id="type"
                name="type"
                placeholder="Enter Type"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rate">Rate</label>
              <input
                type="number"
                onChange={inputHandler}
                id="rate"
                name="rate"
                placeholder="Enter Rating (0-5)"
              />
            </div>
            {/* Crimes Section */}
            <div className="form-group">
              <label>Crimes</label>
              {crimes.map((crime, index) => (
                <div key={index} className="nested-group">
                  <input
                    type="text"
                    name="incident"
                    placeholder="Crime Incident"
                    value={crime.incident}
                    onChange={(e) => handleCrimeChange(index, e)}
                  />
                  <input
                    type="text"
                    name="review"
                    placeholder="Crime Review"
                    value={crime.review}
                    onChange={(e) => handleCrimeChange(index, e)}
                  />
                  <input
                    type="date"
                    name="reportedDate"
                    placeholder="Crime Date"
                    value={crime.reportedDate}
                    onChange={(e) => handleCrimeChange(index, e)}
                  />
                  <button type="button" onClick={() => removeCrime(index)} className="remove-button">
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addCrime} className="add-button">
                + Add More Crimes
              </button>
            </div>

            {/* Grocery Section */}
            <div className="form-group">
              <label>Grocery</label>
              {grocery.map((item, index) => (
                <div key={index} className="nested-group">
                  <input
                    type="text"
                    name="product"
                    placeholder="Product Name"
                    value={item.product}
                    onChange={(e) => handleGroceryChange(index, e)}
                  />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleGroceryChange(index, e)}
                  />
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleGroceryChange(index, e)}
                  />
                  <button type="button" onClick={() => removeGrocery(index)} className="remove-button">
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addGrocery} className="add-button">
                + Add More Grocery Items
              </button>
            </div>
            {/* LandMark Section */}
            <div className="form-group">
              <label htmlFor="landMark">LandMark</label>
              {area.landMark.map((mark, index) => (
                <div key={index} className="nested-group">
                  <input
                    type="text"
                    value={mark}
                    onChange={(e) => {
                      const updatedLandMark = [...area.landMark];
                      updatedLandMark[index] = e.target.value;
                      setArea({ ...area, landMark: updatedLandMark });
                    }}
                    placeholder="Enter LandMark"
                  />
                  <button type="button" onClick={() => removeFromArray("landMark", index)} className="remove-button">
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addToArray("landMark", "")}
                className="add-button"
              >
                + Add LandMark
              </button>
            </div>

            {/* Tags Section */}
            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              {area.tags.map((tag, index) => (
                <div key={index} className="nested-group">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => {
                      const updatedTags = [...area.tags];
                      updatedTags[index] = e.target.value;
                      setArea({ ...area, tags: updatedTags });
                    }}
                    placeholder="Enter Tag"
                  />
                  <button type="button" onClick={() => removeFromArray("tags", index)} className="remove-button">
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addToArray("tags", "")}
                className="add-button"
              >
                + Add Tag
              </button>
            </div>

            {/* Review Section */}
            <div className="form-group">
              <label htmlFor="review">Reviews</label>
              {area.review.map((rev, index) => (
                <div key={index} className="nested-group">
                  <input
                    type="text"
                    value={rev}
                    onChange={(e) => {
                      const updatedReview = [...area.review];
                      updatedReview[index] = e.target.value;
                      setArea({ ...area, review: updatedReview });
                    }}
                    placeholder="Enter Review"
                  />
                  <button type="button" onClick={() => removeFromArray("review", index)} className="remove-button">
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addToArray("review", "")}
                className="add-button"
              >
                + Add Review
              </button>
            </div>


            {/* Image Upload */}
            <div className="form-group">
              <label htmlFor="images">Upload Image</label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                onChange={(e) => setArea({ ...area, images: e.target.files[0] })}
              />
            </div>

            <button type="submit" className="btn-submit">
              Add Area
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;
