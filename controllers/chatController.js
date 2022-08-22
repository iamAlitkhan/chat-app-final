const Chat = require('../Models/ChatModel');
const cloudinary = require('../middlewares/cloudinary');
const fs = require('fs');
var CryptoJS = require("crypto-js");
const config  = require('../config/keys');

exports.getChat = async (req, res) => {

    await Chat.find().populate('sender').exec((err, result) => {
        if (result) {
            return res.status(200).json({ result }); 
        }
        else {
            return res.status(404).json({ errorMessage: 'No Chats found' });
        }
    });
}

exports.indChat = async (req, res) => {
    await Chat.find({ "$or": [{ "sender": req.body.userId, "receiver": req.body.receiverId }, { "sender": req.body.receiverId, "receiver": req.body.userId }]}).populate("sender").exec((error, result) => {
        if (error) {
            res.status(404).json({ errorMessage: 'No Chats found' })
        } else {
            result.map(r => r.message = CryptoJS.AES.decrypt(r.message, config.crptrSecret).toString(CryptoJS.enc.Utf8));
            res.status(200).json({ result });
        }
    })
}


exports.uploadImage = async (req, res) => {
    const { path } = req.file;
    const uploader = await cloudinary.uploads(path, 'ChatImagesOrVideos');
    fs.unlinkSync(path);
    if (uploader) {
        return res.status(200).json(uploader);
    } else {
        return res.status(400).json({ errorMessage: 'error in file upload' });
    }
}