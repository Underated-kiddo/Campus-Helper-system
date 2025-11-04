const express = require("express");
const {
    createTutor,
    getTutors,
    getTutorById,
    updateTutor,
    deleteTutor,
} = require("../controllers/tutorsController");

const router = express.Router();

router.post("/", createTutor);
router.get("/", getTutors);
router.get("/:id", getTutorById);
router.put("/:id", updateTutor);
router.delete("/:id", deleteTutor);

module.exports = router;
