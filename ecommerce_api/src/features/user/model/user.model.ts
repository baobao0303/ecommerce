import mongoose from 'mongoose';
import Joi from 'joi';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (email: string) => {
        return Joi.string().email().validate(email);
      },
      message: 'Invalid email'
    }
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  locality: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (password: string) => {
        return Joi.string().min(8).validate(password);
      },
      message: 'Invalid password'
    }
  }
});
const User = mongoose.model('User', userSchema);

export default User;
