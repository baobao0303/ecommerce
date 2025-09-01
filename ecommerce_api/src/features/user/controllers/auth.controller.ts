import { NextFunction, Request, Response } from 'express';
import User from '~/features/user/model/user.model';
import { BadRequestException } from '~/globals/cores/error.core';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

class AuthController {
  public getAll(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      message: 'Get all auths successfully',
      data: []
    });
  }
  // CREATE AUTH - SIGNUP BASICALLY
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, password } = req.body;
      const newUser = await User.findOne({ email });
      if (newUser) {
        return next(new BadRequestException('User already exists'));
      }
      const user = await User.create({ fullName, email, password });

      res.status(201).json({
        message: 'Signup successfully',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
  //TODO: CREATE AUTH - SIGNUP EMAIL VERIFICATION
  public async signUpEmailVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        //TODO: SEND EMAIL VERIFICATION
      }

      res.status(200).json({
        message: 'Email verification sent successfully',
        data: {
          user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // LOGIN AUTH - SIGNIN BASICALLY
  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(new BadRequestException('User not found'));
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return next(new BadRequestException('Invalid password'));
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      res.status(200).json({
        message: 'Signin successfully',
        data: user,
        token
      });
    } catch (error) {
      next(error);
    }
  }

  // FORGOT PASSWORD
  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(new BadRequestException('User not found'));
      }
      // GENERATE PASSWORD RANDOMLY
      const generatePassword = crypto.randomBytes(8).toString('hex');
      const hashedPassword = await bcrypt.hash(generatePassword, 10);

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

      // UPDATE PASSWORD
      await User.findByIdAndUpdate(user._id, { password: hashedPassword });

      res.status(200).json({
        message: 'Forgot password sent successfully',
        data: user,
        token
      });
    } catch (error) {
      next(error);
    }
  }
}
const authController: AuthController = new AuthController();
export default authController;
