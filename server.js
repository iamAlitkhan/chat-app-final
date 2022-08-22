const express = require('express');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const mongoose = require('mongoose');
const config = require('./config/keys');
const Chat = require('./Models/ChatModel');
const User = require('./Models/userModel');
const path = require('path');
var CryptoJS = require("crypto-js");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
    }
}
);



/******************************************MiddleWares  ********************************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);

/******************************************MongoDb Connection********************************************/

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('MongoDb Connected')).catch(err => console.log(err));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('./client/build'));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));

    });
}

const sessionsMap = {};
io.on('connection', socket => {
    console.log('New Connection');
    socket.on("join", ({ userId, username }) => {
        sessionsMap[userId] = socket.id;
        console.log(sessionsMap);
        socket.on("Get Online Status", (online) => {
            const receiverId = sessionsMap[online.receiver];
            if (receiverId) {
                socket.emit('Outputting Online Status', `Online`);
            } else {
                socket.emit("Outputting Online Status", "");
            }
        });


        socket.on("The user is typing....", (typing) => {
            const receiverId = sessionsMap[typing.receiver];
            socket.broadcast.to(receiverId).emit('outputting typing', `Typing...`);
        });

        socket.on("Input Chat Message", (msg) => {
            var encryptedMessage = CryptoJS.AES.encrypt(msg.message, config.crptrSecret).toString();
            let chat = new Chat({
                message: encryptedMessage,
                cloudinary_id: msg.cloudinary_id,
                sender: msg.userId,
                receiver: msg.receiver,
                timeOfSending: msg.nowTime,
                type: msg.type
            });

            chat.save(async (error, doc) => {
                if (error) {
                    console.log(error);
                }
                await User.findOne({ _id: doc.sender }).exec(async (err, getSender) => {
                    if (err) {
                        console.log(err)
                    } else {
                        doc.sender = getSender;
                        var bytes = CryptoJS.AES.decrypt(doc.message, config.crptrSecret);
                        var decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
                        doc.message = decryptedMessage;
                        const receiverId = sessionsMap[msg.receiver];
                        socket.broadcast.to(receiverId).emit('Output Chat Message', doc);
                        socket.emit("Output Chat Message", doc);
                    }
                })
            });
        });

    });

});

server.listen(process.env.PORT || 8000, () => console.log('Listening to port 8000'));


