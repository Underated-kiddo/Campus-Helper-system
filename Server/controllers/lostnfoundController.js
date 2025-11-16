const Lostnfound = require("../models/Lostnfound");

exports.addLostItem = async (req, res) => {
    try {
        const { name, item_found, item_description, phone_number } = req.body;

        if (!name || !item_found || !item_description || !phone_number) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newItem = new Lostnfound({
            Full_name: {
                name,
                phone_number,
            },
            item_found,
            item_description,
            uploaded_image: req.file
                ? {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                }
                : null,
        });

        await newItem.save();

        res.status(201).json({
            message: "Lost item posted",
            data: newItem,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLostItems = async (req, res) => {
    try {
        const items = await Lostnfound.find().sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
