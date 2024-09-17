import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';// Adjust path to your User model

export const register = async (req, res) => {
  const { Fullname, email, password, phone, role } = req.body;

  // Check if all fields are filled
  if (!Fullname || !email || !password || !phone || !role) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  try {
    // Check if a user with the provided phone number or email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ Fullname, email, password: hashedPassword, phone, role });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const login = async (req, res) => {
  const { phone, password } = req.body;

  // Check if all fields are filled
  if (!phone || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with success message, token, and user role
    res.json({
      message: 'Login Successful',
      token,
      role: user.role,
      email: user.email,
      Fullname: user.Fullname,
      phone : user.phone
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  const { email } = req.params; // Assuming email is passed as a route parameter

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's details excluding sensitive information
    const userProfile = {
      name: user.Fullname,
      email: user.email,
      phone: user.phone
    };

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
