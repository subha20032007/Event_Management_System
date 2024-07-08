const { db } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send({ message: 'Please provide all required fields' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error checking existing user:', err);
            return res.status(500).send({ message: 'Server error' });
        }

        if (results.length > 0) {
            return res.status(400).send({ message: 'User already exists with this email' });
        }

        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).send({ message: 'Server error' });
            }

            res.status(201).send({ message: 'User registered successfully!' });
        });
    });
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'Please provide all required fields' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).send({ message: 'Server error' });
        }

        if (results.length === 0) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        const user = results[0];

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).send({ message: 'Login successful!', token,user });
    });
};

  
exports.forgotPasswordController = async (req, res) => {
    try {
        const { email, username, newPassword } = req.body;

        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }

        if (!username) {
            return res.status(400).send({ message: "Username is required" });
        }

        if (!newPassword) {
            return res.status(400).send({ message: "New Password is required" });
        }

        // Check user existence
        db.query('SELECT * FROM users WHERE email = ? AND username = ?', [email, username], async (err, results) => {
            if (err) {
                console.error('Error checking user:', err);
                return res.status(500).send({ message: "Server error" });
            }

            if (results.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: "Wrong Email Or Username",
                });
            }

            const user = results[0];

        
            const hashedPassword = await bcrypt.hash(newPassword, 10);

         
            db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id], (err, result) => {
                if (err) {
                    console.error('Error updating password:', err);
                    return res.status(500).send({ message: "Server error" });
                }

                res.status(200).send({
                    success: true,
                    message: "Password Reset Successfully",
                });
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};