import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../NavBar.jsx";
import "./Edit.css";

const Edit = () => {
  const initialAreaState = {
    name: "",
    city: "",
    state: "",
    country: "",
    postCode: "",
    landMark: [],
    tags: [],
    type: "",
    rate: 0,
    crimes: [{ incident: "", review: "" }],
    grocery: [{ product: "", quantity: 0, price: 0 }],
    review: [],
    events: [],
    tourPlaces: [],
    images: [], // Array to store current images
  };

  const { id } = useParams();
  const navigate = useNavigate();
  const [Area, setArea] = useState(initialAreaState);
  const [deleteImages, setDeleteImages] = useState([]); // Track images to delete
  const [newImage, setNewImage] = useState(null); // Track new image uploads

  useEffect(() => {
    axios
      .get(`http://localhost:8000/adminArea/getAreaByid/${id}`)
      .then((response) => setArea(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setArea({ ...Area, [name]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...Area[field]];
    updatedArray[index] = value;
    setArea({ ...Area, [field]: updatedArray });
  };

  const addToArray = (field, value) => {
    setArea({ ...Area, [field]: [...Area[field], value] });
  };

  const removeFromArray = (field, index) => {
    const updatedArray = [...Area[field]];
    updatedArray.splice(index, 1);
    setArea({ ...Area, [field]: updatedArray });
  };

  const handleNestedChange = (e, index, type) => {
    const { name, value } = e.target;
    const updatedNested = [...Area[type]];
    updatedNested[index][name] = value;
    setArea({ ...Area, [type]: updatedNested });
  };

  const addNestedField = (type) => {
    const newField = type === "crimes" ? { incident: "", review: "" } : { product: "", quantity: 0, price: 0 };
    setArea({ ...Area, [type]: [...Area[type], newField] });
  };

  const removeNestedField = (index, type) => {
    const updatedNested = [...Area[type]];
    updatedNested.splice(index, 1);
    setArea({ ...Area, [type]: updatedNested });
  };

  const handleImageDelete = (image) => {
    setDeleteImages([...deleteImages, image]); // Mark image for deletion
    setArea({ ...Area, images: Area.images.filter((img) => img !== image) }); // Remove image from current display
  };

  const handleNewImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(Area).forEach(([key, value]) => {
      if (key === "images" && newImage) {
        formData.append("images", newImage); // Append new image file
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value)); // Convert arrays to JSON strings
      } else {
        formData.append(key, value); // Append other data directly
      }
    });

    // Append images marked for deletion
    if (deleteImages.length > 0) {
      formData.append("deleteImages", JSON.stringify(deleteImages));
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/adminArea/updateArea/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(response.data.msg, { position: "top-right" });
      navigate("/getAll");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="editArea container">
        <h3 className="text-center title">Edit Area</h3>
        <form onSubmit={submitForm} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">Area Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={Area.name}
              onChange={inputChangeHandler}
              placeholder="Enter Area Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={Area.city}
              onChange={inputChangeHandler}
              placeholder="Enter City"
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={Area.state}
              onChange={inputChangeHandler}
              placeholder="Enter State"
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={Area.country}
              onChange={inputChangeHandler}
              placeholder="Enter Country"
            />
          </div>
          <div className="form-group">
            <label htmlFor="postCode">PostCode</label>
            <input
              type="number"
              id="postCode"
              name="postCode"
              value={Area.postCode}
              onChange={inputChangeHandler}
              placeholder="Enter PostCode"
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={Area.type}
              onChange={inputChangeHandler}
              placeholder="Enter Type"
            />
          </div>

          {/* Dynamic Fields for Arrays */}
          {["landMark", "tags", "review"].map((field) => (
            <div key={field} className="form-group">
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {Area[field].map((item, index) => (
                <div key={index} className="nested-group">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(field, index, e.target.value)}
                    placeholder={`Enter ${field}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeFromArray(field, index)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addToArray(field, "")}
                className="add-button"
              >
                + Add {field.charAt(0).toUpperCase() + field.slice(1)}
              </button>
            </div>
          ))}

          {/* Crimes Section */}
          <div className="form-group">
            <label>Crimes</label>
            {Area.crimes.map((crime, index) => (
              <div key={index} className="nested-field">
                <input
                  type="text"
                  name="incident"
                  value={crime.incident}
                  placeholder="Incident"
                  onChange={(e) => handleNestedChange(e, index, "crimes")}
                />
                <input
                  type="text"
                  name="review"
                  value={crime.review}
                  placeholder="Review"
                  onChange={(e) => handleNestedChange(e, index, "crimes")}
                />
                <button
                  type="button"
                  onClick={() => removeNestedField(index, "crimes")}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addNestedField("crimes")}
              className="btn-add"
            >
              + Add Crime
            </button>
          </div>

          {/* Grocery Section */}
          <div className="form-group">
            <label>Grocery</label>
            {Area.grocery.map((item, index) => (
              <div key={index} className="nested-field">
                <input
                  type="text"
                  name="product"
                  value={item.product}
                  placeholder="Product"
                  onChange={(e) => handleNestedChange(e, index, "grocery")}
                />
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  placeholder="Quantity"
                  onChange={(e) => handleNestedChange(e, index, "grocery")}
                />
                <input
                  type="number"
                  name="price"
                  value={item.price}
                  placeholder="Price"
                  onChange={(e) => handleNestedChange(e, index, "grocery")}
                />
                <button
                  type="button"
                  onClick={() => removeNestedField(index, "grocery")}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addNestedField("grocery")}
              className="btn-add"
            >
              + Add Grocery Item
            </button>
          </div>

          {/* Current Images Section */}
          <div className="form-group">
            <label>Current Images</label>
            <div className="image-preview">
              {Area.images.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image} alt={`Area ${index}`} className="image-thumbnail" />
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleImageDelete(image)}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>


          {/* Upload New Images */}
          <div className="form-group">
            <label htmlFor="newImage">Upload New Image</label>
            <input type="file" id="newImage" onChange={handleNewImageChange} />
          </div>

          <button type="submit" className="submit-button">
            Update Area
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;