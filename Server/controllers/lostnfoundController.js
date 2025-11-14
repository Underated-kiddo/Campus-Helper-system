const Lostnfound = require("../models/Lostnfound");

// Add new lost item
exports.addLostItem = async (req, res) => {
    try {
        const { name, item_found, item_description, phone_number } = req.body;
        const upload_image = req.file ? req.file.path : null;

        if (!name || !item_found || !item_description || !phone_number ) {
            return res.status(400).json({ message: "All necessary fields  are required" });
        }

        const newItem = new Lostnfound({
            Full_name: {
                name,
                phone_number,
            },
            item_found,
            item_description,
            upload_image,
        });

        await newItem.save();
        res.status(201).json({ message: "Lost item Posted successfully", data: newItem });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all lost items
exports.getLostItems = async (req, res) => {
    try {
        const items = await Lostnfound.find().sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
