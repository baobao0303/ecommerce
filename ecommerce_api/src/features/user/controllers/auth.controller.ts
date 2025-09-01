import { NextFunction, Request, Response } from 'express';
import User from '~/features/user/models/user.model';
import { BadRequestException } from '~/globals/cores/error.core';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendTokenViaCookie from '~/globals/helpers/cookie.helper';
import { generateToken } from '~/globals/helpers/jwt.helper';
import HttpConstants from '~/globals/constants/http.constants';

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
      const { fullName, name, email, password, state, city, locality } = req.body;
      const newUser = await User.findOne({ email });
      if (newUser) {
        return next(new BadRequestException('User already exists'));
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        fullName,
        name,
        email,
        password: hashedPassword.toString(),
        state,
        city,
        locality,
        role: 'user'
      });

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

      res.status(HttpConstants.SUCCESS).json({
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
      const token = generateToken({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        fullName: user.fullName
      });

      // SEND TOKEN VIA COOKIE
      await sendTokenViaCookie(res, (await token).accessToken);

      res.status(HttpConstants.SUCCESS).json({
        message: 'Signin successfully',
        data: user,
        token
      });
    } catch (error) {
      console.log(error);
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

      res.status(HttpConstants.SUCCESS).json({
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
