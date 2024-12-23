import User from "../models/userModel.js";
import AreaModel from "../models/areaModel.js";
export const AddUser = async(req, res)=>{
    try{
        const user = User(req.body);
        if(!user){
            res.status(404).json({msg:"User data is empty"})
        }
        await user.save();
        res.status(200).json({msg:'Succesfully created User', User:user});
    }catch(error){
        res.status(500).json({error : error.message})
    }
}

export const GetUser = async(req, res)=>{
    try{
        const data =  req.params.data;
        const arr = data.split(',');
        const email = arr[0];
        const pass = arr[1];
        const user = await User.findOne({email : email});
        if(Object.keys(user).length==0 || user.pass!=pass){
            res.status(404).json({msg:"User Not Found"})
        }
        else{
            res.status(200).json({User : user});
        }
    }catch(error){
        res.status(500).json({error : error.message})
    }
}

export const AddHistory = async (req, res) => {
    try {
        const { id, userid } = req.params;
        const user = await User.findById(userid);
        
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Remove existing occurrence of the item, if any
        user.histry = user.histry.filter((item) => item !== id);

        // Add the new item at the first position
        user.histry.unshift(id);

        await user.save();

        res.status(200).json({ msg: "History item added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const GetHistory = async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await User.findById(userid);
    
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
    
        const { histry } = user;
        if (!histry || histry.length === 0) {
            return res.status(200).json({ msg: "User has no history", areas: [] });
        }
    
        // Fetch areas based on history
        const areas = await AreaModel.find({ _id: { $in: histry } });
    
        // Check if areas have images
        areas.forEach(area => {
            if (area.images && area.images.length > 0) {
                console.log(`Image path for ${area.name}:`, area.images[0]);
            }
        });
        res.status(200).json({areas});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}    

export const AddFav = async (req, res) => {
    try {
        const { id, userid } = req.params; 
        const user = await User.findById(userid); 
        
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (user.histry.includes(id)) {
            return res.status(400).json({ msg: "Fav item already exists" });
        }
        user.fev.push(id);
        await user.save();

        res.status(200).json({ msg: "Fav item added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const GetFav = async (req, res) => {
    try {
        const { userid, id } = req.params; 
        const user = await User.findById(userid); 

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        if (user.fav.includes(id)) {
            return res.status(400).json({ msg: "yes" });
        }
        res.status(200).json({ msg:"no" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const AddInterest = async (req, res) => {
    try {
        const { userid } = req.params; // Extract user ID from the URL
        const { Interests } = req.body; // Extract new interests from the request body

        // Check if new interests were provided
        if (!Interests || !Array.isArray(Interests) || Interests.length === 0) {
            return res.status(400).json({ msg: "No valid interests provided" });
        }

        // Find the user by ID
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Add the new interests to the existing ones, ensuring no duplicates
        const updatedInterests = [...new Set([...user.interests, ...Interests])];

        // Update the user's interests
        user.interests = updatedInterests;
        await user.save();

        res.status(200).json({ msg: "Interests added successfully", interests: updatedInterests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const getInterested = async (req, res) => {
    try {
        const { userid } = req.params;
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const { interests } = user;
        if (!interests || interests.length === 0) {
            return res.status(200).json({ msg: "User has no interests", areas: [] });
        }

        const areas = await AreaModel.find({ tags: { $in: interests } });

        res.status(200).json({ msg: "Interested areas fetched successfully", areas });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAll = async (req, res) => {
    try {
        const areas = await AreaModel.find();
        if (!areas) {
            return res.status(404).json({ msg: "Areas not found" });
        }

        res.status(200).json({ msg: "Areas fetched successfully", areas });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const searchAreas = async (req, res) => {
    try {
        const { search } = req.query; // Input search string
        if (!search || search.trim().length === 0) {
            return res.status(400).json({ msg: "Search query is required" });
        }

        const searchTerms = search.split(" ").map(term => term.trim()).filter(term => term.length > 0); // Split search into individual terms
        
        // Create an array of regexes for each term
        const regexArray = searchTerms.map(term => new RegExp(term, "i")); // Case-insensitive regex

        // Query with priority: city > state > tags > type > tourPlaces > landMark > country
        const areas = await AreaModel.find({
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

        if (areas.length === 0) {
            return res.status(404).json({ msg: "No areas found for the search query" });
        }

        res.status(200).json({ msg: "Search results", areas });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const searchAreasbyId = async (req, res) => {
    try {
        const { id } = req.params; // Input search string
        
        // Find the area by ID
        const area = await AreaModel.findById(id);

        if (!area) {
            return res.status(404).json({ msg: "Area not found" });
        }

        // Define priority order for fields
        const priorityQueries = [
            { name: new RegExp(area.name, "i")},
            { tags: new RegExp(area.tags, "i") }, // Join array elements for regex
            { city: new RegExp(area.city, "i") },
            { type: new RegExp(area.type, "i") },
            { tourPlaces: new RegExp(area.tourPlaces, "i") }, // Join array elements for regex
            { landMark: new RegExp(area.landMark, "i") },
            { state: new RegExp(area.state, "i") },
            { country: new RegExp(area.country, "i") },
        ];

        // Collect results in order of priority
        let orderedAreas = [];
        for (const query of priorityQueries) {
            const results = await AreaModel.find(query).exec();
            orderedAreas.push(...results);
        }

        // Remove duplicates (by ID) to ensure unique results
        const uniqueAreas = [...new Map(orderedAreas.map(item => [item._id.toString(), item])).values()];
        const updatedAreas = uniqueAreas.filter(area => area._id.toString() !== id);
        if (updatedAreas.length === 0) {
            return res.status(404).json({ msg: "No areas found for the search query" });
        }

        res.status(200).json({ msg: "Search results", areas: updatedAreas });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

