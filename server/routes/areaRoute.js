import express from 'express';
import { AddArea, UpdateArea, upload,  DeleteArea, GetArea, GetAllArea, GetCity, GetState, GetByTour, DeleteAreaById, GetSearch, GetAreaById } from '../controller/adminAreaController.js';

const areaRoute = express.Router();

areaRoute.post("/addArea", upload.array("images"), AddArea);
areaRoute.put("/updateArea/:id", upload.array("images"), UpdateArea);
areaRoute.delete('/deleteArea/:name', DeleteArea);
areaRoute.delete('/deleteAreaById/:id', DeleteAreaById);
areaRoute.get('/getOne/:name', GetArea);
areaRoute.get('/getAll', GetAllArea);
areaRoute.get('/getCity/:city', GetCity);
areaRoute.get('/getState/:state', GetState);
areaRoute.get('/getTour/:tourPlaces', GetByTour);
areaRoute.get('/getSearch/:search', GetSearch);
areaRoute.get('/getAreaById/:id', GetAreaById);

export default areaRoute;