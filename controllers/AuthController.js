import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//Load the Models
import User from '../models/Users.js';

import { AppConfig } from '../config/index.js';
import { FormatUserRequest, emailSettings } from '../utils/FormatUserRequest.js';

class AuthController {
  static async login(request, response) {
    try {
      //Find user by email
      let user = await User.findOne({ email: request.body.email });
      if (!user) {
        const userData = await FormatUserRequest(request.body);
        user = await User.create(userData);
      }

      const validPassword = await bcrypt.compare(request.body.password, user.password);
      if (!validPassword) return response.status(401).send({ message: 'Invalid password.' });

      const payload = { id: user.id, email: user.email };
      const token = jwt.sign(payload, AppConfig.tokenSecretOrKey, { expiresIn: 3600 });

      return response.status(200).send({
        message: 'successfully logged in',
        ...user._doc,
        id: user._id,
        accessToken: token,
        refreshToken: token,
        emailSettings,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }

  static async getCurrentUser(request, response) {
    try {
      let user = await User.findOne({ _id: request.user.id });
      const payload = { id: user._id, email: user.email };
      const token = jwt.sign(payload, AppConfig.tokenSecretOrKey, { expiresIn: 3600 });
      return response.status(200).send({
        ...user,
        id: user._id,
        accessToken: token,
        refreshToken: token,
        emailSettings,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong.' });
    }
  }
}

export default AuthController;
