
const express = require('express');
const { registerUser,loginUser, forgotPasswordController } = require('../controllers/authController');

const router = express.Router();
router.post('/forgot-password', forgotPasswordController);
router.post('/register', registerUser);
router.post('/login', loginUser);
module.exports = router;
