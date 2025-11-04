const LostNFound = require("../models/Lostnfound");

exports.createItem = async (req, res) => {
    try {
        const { name, description, contact } = req.body;
        let picture = null;

        if (req.file) {
            picture = `/uploads/${req.file.filename}`;
        } else if (req.body.picture) {
            picture = req.body.picture;
        }

        const newItem = new LostNFound({
            name,
            description,
            contact,
            picture,
        });

        await newItem.save();
        res.status(201).json({ message: "Item added successfully", newItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding item", error });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await LostNFound.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items", error });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await LostNFound.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Error fetching item", error });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const deleted = await LostNFound.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Item not found" });
        res.status(200).json({ message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error });
    }
};
