import express from  'express';
import { AddAdmin, GetAdmin } from '../controller/adminController.js';

const adminRoute = express.Router();

adminRoute.post("/addAdmin", AddAdmin);
adminRoute.get("/getAdmin/:data", GetAdmin);

export default adminRoute;