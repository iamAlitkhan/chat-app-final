const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    image: {
        type: String,
        require: true
    },
    cloudinary_id: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true }
);

const userModel = new mongoose.model('User', userSchema);
module.exports = userModel;
