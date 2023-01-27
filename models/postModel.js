const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    body: {
        type: String,
        required: [true, 'Please add a body']
    }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;