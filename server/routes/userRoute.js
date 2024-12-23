import express from "express";
import {
    AddUser,
    GetUser,
    AddHistory,
    GetHistory,
    AddFav,
    GetFav,
    getInterested,
    searchAreas,
    AddInterest,
    searchAreasbyId,
    getAll
} from "../controller/userController.js";

const userRoute = express.Router();

// User-related routes
userRoute.post("/addUser", AddUser); // Add a new user
userRoute.get("/getUser/:data", GetUser); // Get a user by email and password
userRoute.post("/addHistory/:userid/:id", AddHistory); // Add a history item for a user
userRoute.get("/getHistory/:userid", GetHistory); // Get the history for a user
userRoute.post("/addFav/:userid/:id", AddFav); // Add a favorite item for a user
userRoute.post("/addInterests/:userid", AddInterest);
userRoute.get("/getFav/:userid/:id", GetFav); // Check if a favorite item exists
userRoute.get("/getInterested/:userid", getInterested); // Get areas of interest for a user
userRoute.get("/:userId/searchAreas", searchAreas); // Search areas with multiple criteria
userRoute.get("/related/:id", searchAreasbyId);
userRoute.get("/getAll", getAll);

export default userRoute;
