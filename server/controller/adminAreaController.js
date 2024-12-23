import multer from 'multer';
import path from 'path';
import fs from 'fs';
import AreaModel from '../models/areaModel.js'; // Replace with your model path


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "D:/MERN Projects/Area HUB/client/public/images");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

export const upload = multer({ storage });




// Add a new area with image upload
export const AddArea = async (req, res) => {
    try {
        const { name, city, state, country, postCode, landMark, tags, type, rate, crimes, grocery, events, tourPlaces, review } = req.body;
        const imagePaths = req.files ? req.files.map(file => `/images/${file.filename}`) : [];
        if (!name || !city || !state || !country || !postCode) {
            return res.status(400).json({ 
                error: "Missing required fields: name, city, state, country, or postCode." 
            });
        }
        

        const area = new AreaModel({
            name,
            city,
            state,
            country,
            postCode,
            landMark: landMark ? JSON.parse(landMark) : [],
            tags: tags ? JSON.parse(tags) : [],
            review : review ? JSON.parse(review):[],
            type,
            rate,
            crimes: crimes ? JSON.parse(crimes) : [],
            grocery: grocery ? JSON.parse(grocery) : [],
            events: events ? JSON.parse(events) : [],
            tourPlaces: tourPlaces ? JSON.parse(tourPlaces) : [],
            images: imagePaths,
        });
        await area.save();

        res.status(200).json({ msg: "Area added successfully", area });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Update an area with optional new images and image deletion
export const UpdateArea = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            name,
            city,
            state,
            country,
            postCode,
            landMark,
            tags,
            type,
            rate,
            crimes,
            grocery,
            events,
            tourPlaces,
            review,
            deleteImages, // List of images to delete
        } = req.body;

        const newImagePaths = req.files ? req.files.map((file) => `/images/${file.filename}`) : [];

        const area = await AreaModel.findById(id);

        if (!area) {
            return res.status(404).json({ msg: "Area not found" });
        }

        // Handle image deletion
        if (deleteImages && deleteImages.length > 0) {
            const imagesToDelete = JSON.parse(deleteImages); // Parse the array of images to delete
            area.images = area.images.filter((image) => !imagesToDelete.includes(image));

            // Delete files from the filesystem
            imagesToDelete.forEach((filePath) => {
                const absolutePath = path.join("D:/MERN Projects/Area HUB/client/public", filePath);
                fs.unlink(absolutePath, (err) => {
                    if (err) {
                        console.error(`Error deleting file: ${absolutePath}`, err);
                    } else {
                        console.log(`File deleted: ${absolutePath}`);
                    }
                });
            });
        }

        // Add new images if any
        if (newImagePaths.length > 0) {
            area.images = [...area.images, ...newImagePaths];
        }

        // Update other fields
        area.name = name || area.name;
        area.city = city || area.city;
        area.state = state || area.state;
        area.country = country || area.country;
        area.postCode = postCode || area.postCode;
        area.landMark = landMark ? JSON.parse(landMark) : area.landMark;
        area.review = review ? JSON.parse(review) : area.review;
        area.tags = tags ? JSON.parse(tags) : area.tags;
        area.type = type || area.type;
        area.rate = rate || area.rate;
        area.crimes = crimes ? JSON.parse(crimes) : area.crimes;
        area.grocery = grocery ? JSON.parse(grocery) : area.grocery;
        area.events = events ? JSON.parse(events) : area.events;
        area.tourPlaces = tourPlaces ? JSON.parse(tourPlaces) : area.tourPlaces;

        await area.save();

        res.status(200).json({ msg: "Area updated successfully", area });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const GetArea = async(req, res)=>{
    try{
        const name = req.params.name;
        const area = await AreaModel.findOne({name:name});
        if(!area){
            res.status(404).json({msg:'Area data not found'});
        }
        console.log(area.images[0]);
        res.status(200).json(area);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}


export const GetAreaById = async (req, res) => {
    try {
        const { id } = req.params; // Assuming you're fetching by area ID
        const area = await AreaModel.findOne({ _id: id });

        if (!area) {
            return res.status(404).json({ message: "Area not found" });
        }

        // Send response including the image (Base64 encoded)
        res.status(200).json(area)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const GetCity = async(req, res)=>{
    try{
        const city = req.params.city;
        const area = await AreaModel.find({city:city});
        if(!area){
            res.status(404).json({msg:'Area data not found'});
        }
        res.status(200).json(area);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

export const GetState = async(req, res)=>{
    try{
        const state = req.params.state;
        const area = await AreaModel.find({state:state});
        if(!area){
            res.status(404).json({msg:'Area data not found'});
        }
        res.status(200).json(area);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

export const GetAllArea = async(req, res)=>{
    try{
        const area = await AreaModel.find();
        if(!area){
            res.status(404).json(area);
        }
        res.status(200).json(area);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

export const DeleteArea = async(req, res)=>{
    try{
        const name = req.params.name;
        const area = await AreaModel.findOneAndDelete({name:name});
        if(!area){
            res.status(404).json({msg:'Area data not found'});
        }
        res.status(200).json({msg:"Area Deleted Succesfully"});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

export const DeleteAreaById = async(req, res)=>{
    try{
        const id = req.params.id;
        const area = await AreaModel.findByIdAndDelete(id);
        if(!area){
            res.status(404).json({msg:'Area data not found'});
        }
        res.status(200).json({msg:"Area Deleted Succesfully"});
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

export const GetByTour = async(req, res)=>{
    try{
        const tourPlaces = req.params.tourPlaces;
        const area = await AreaModel.find({tourPlaces:tourPlaces});
        if(!area){
            res.status(404).json({msg:'Area data not found'});
        }
        res.status(200).json(area);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

export const GetSearch = async(req, res)=>{
    try {
        const { search } = req.params; // Input search string
        if (!search || search.trim().length === 0) {
            return res.status(400).json({ msg: "Search query is required" });
        }

        const searchTerms = search.split(" ").map(term => term.trim()).filter(term => term.length > 0); // Split search into individual terms
        
        // Create an array of regexes for each term
        const regexArray = searchTerms.map(term => new RegExp(term, "i")); // Case-insensitive regex

        // Query with priority: city > state > tags > type > tourPlaces > landMark > country
        const area = await AreaModel.find({
            $or: [
                { name : {$in: regexArray}},
                { city: { $in: regexArray } }, // Matches any term in the city
                { state: { $in: regexArray } }, // Matches any term in the state
                { tags: { $in: searchTerms } }, // Matches exact terms in tags array
                { type: { $in: regexArray } }, // Matches any term in type
                { tourPlaces: { $in: searchTerms } }, // Matches exact terms in tourPlaces array
                { landMark: { $in: searchTerms } }, // Matches exact terms in landMark array
                { country: { $in: regexArray } }, // Matches any term in country
            ],
        });

        if (area.length === 0) {
            return res.status(404).json({ msg: "No areas found for the search query" });
        }

        res.status(200).json({ msg: "Search results", area });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}