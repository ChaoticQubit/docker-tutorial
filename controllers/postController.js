const Post = require('../models/postModel');

exports.getPosts = async (req, res, next) => {
    try{
        const posts = await Post.find();
        res.status(200).json({
            status: 'success',
            results: posts.length,
            data: {
                posts
            }
        });
    } catch (e) {
        res.status(404).json({
            status: 'fail',
            message: e
        });
    }
}

exports.getOnePost = async (req, res, next) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                post
            }
        });
    } catch (e) {
        res.status(404).json({
            status: 'fail',
            message: e
        });
    }
}

exports.createPost = async (req, res, next) => {
    try{
        const newPost = await Post.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                post: newPost
            }
        });
    } catch (e) {
        
        res.status(400).json({
            status: 'fail',
            message: e
        });
    }
}

exports.updatePost = async (req, res, next) => {
    try{
        const updatePost = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
            });
        res.status(201).json({
            status: 'success',
            data: {
                post: updatePost
            }
        });
    } catch (e) {
        res.status(400).json({
            status: 'fail',
            message: e
        });
    }
}

exports.deletePost = async (req, res, next) => {
    try{
        await Post.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (e) {
        res.status(404).json({
            status: 'fail',
            message: e
        });
    }
}