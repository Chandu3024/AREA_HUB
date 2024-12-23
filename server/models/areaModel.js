import mongoose from "mongoose";

const areaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    path:"city",
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  postCode: {
    type: String,
    required: true,
  },
  landMark: {
    type: [String], // Array of landmarks
  },
  tags: {
    type: [String], // Array of tags for categorization
  },
  type: {
    type: String, // Type of area (e.g., residential, commercial)
  },
  rate: {
    type: Number,
    default: 0, // Rating out of 5, default is 0
  },
  review: {
    type: [String], // Array of reviews
  },
  crimes: [
    {
      incident: {
        type: String, // Description of the crime
      },
      review: {
        type: String, // Comments or additional details
      },
      reportedDate: {
        type: Date, // When the crime was reported
      },
    },
  ],
  grocery: [
    {
      product: {
        type : String
      },
      quantity: {
        type: Number, // Quantity available
      },
      price: {
        type: Number, // Price of the product
      },
    },
  ],
  events: {
    type: [String], // Array of event descriptions
  },
  tourPlaces: {
    type: [String], // Array of tourist place descriptions
  },
  images: {
    type:[String],
    default : "/images/placeholder.jpg"
  },
  // Optional: Add a flexible "extras" field for additional dynamic properties
  extras: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // Allows dynamic key-value pairs
  },
});

export default mongoose.model("AreaModel", areaSchema);
