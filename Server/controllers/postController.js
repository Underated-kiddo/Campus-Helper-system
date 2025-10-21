const Post = require("../models/Post");

//POST /api/posts
exports.createPost = async (req,res) =>{
    const post = await Post.create({...req.body, owner: req.user.id});
    res.json(post);
};

//GET /api/post/me
exports.getMyPosts = async (req ,res) => {
    const posts = await Post.find({ owner: req.user.id});
    res.json(posts);
};

//GET /api/post/all
exports.getAllPosts = async(req ,res) =>{
    const tasks = await Post.find().populate("owner","email");
    res.json(tasks);
};