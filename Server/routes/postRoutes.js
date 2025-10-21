const express = require("express");
const { createPost, getMyPosts,getAllPosts } = require ("../controllers/postController");
const { protect , authorize } = require("../middleware/auth");
const router = express.Router();

router.post("/", protect, createPost);
router.get("/me", protect,getMyPosts);
router.get("/all", protect , authorize(["admin"]), getAllPosts);

module.exports = router ;