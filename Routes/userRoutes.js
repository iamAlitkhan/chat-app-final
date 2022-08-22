const express = require('express');
const upload = require('../middlewares/multer');
const { signUp, login, getAllUsers, getUserById } = require('../controllers/userController');
const { AuthenticatorJWT } = require('../middlewares/authenticator');

const router = express.Router();

router.post('/signup', upload.single('file'), signUp);
router.post('/login', login);
router.get('/get', AuthenticatorJWT, getAllUsers);
router.get('/get/:id', getUserById);

module.exports = router;