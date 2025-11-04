const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadResource, getResources } = require("../controllers/resourcesController");
const { protect } = require("../middleware/auth");

router.post(
    "/upload",
    protect,
    upload.single("file"),
    async (req, res, next) => {
        try {
            await uploadResource(req, res);
        } catch (error) {
            console.error("Upload error:", error.message);
            res.status(500).json({ message: "File upload failed", error: error.message });
        }
    }
);

router.get("/", async (req, res) => {
    try {
        await getResources(req, res);
    } catch (error) {
        console.error("Fetch error:", error.message);
        res.status(500).json({ message: "Failed to fetch resources", error: error.message });
    }
});

module.exports = router;