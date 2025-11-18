const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

exports.register = async (req, res, next) => {
  try {
    // Manual Validation
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({ message: "Username and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).send({ message: "Username already taken." });
    }

    const user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    await user.save();
    res.status(201).send({ message: "User registered successfully!" });
  } catch (err) {
    next(err); // Pass error to global handler
  }
};

exports.login = async (req, res, next) => {
  try {
    // Manual Validation
    if (!req.body.username || !req.body.password) {
      return res.status(400).send({ message: "Username and password are required." });
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
        accessToken: null
      });
    }

    const token = jwt.sign({ id: user._id }, 'secretkey', {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      accessToken: token
    });
  } catch (err) {
    next(err);
  }
};