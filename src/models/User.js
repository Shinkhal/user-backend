import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  Fullname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        // Regular expression for validating an email address
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`, // Custom error message
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8, 
    validate: {
      validator: function (v) {
        return /\d/.test(v); 
      },
      message: props => `${props.value} should contain at least one number!`, 
    },
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
    required: true, 
    unique: true
  },
  role: { type: String, enum: ['farmer', 'consumer'], required: true },
});

export default mongoose.model('User', userSchema);
