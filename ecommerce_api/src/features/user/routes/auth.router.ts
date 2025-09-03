import express from 'express';
import authController from '../controllers/auth.controller';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import validateSchema from '~/globals/middlewares/validateSchema.middleware';
import { signInSchema, signUpSchema } from '../schemas/auth.schema';

const authRouter = express.Router();

authRouter.post('/signup', validateSchema(signUpSchema), asyncWrapper(authController.signUp));
authRouter.post('/signin', validateSchema(signInSchema), asyncWrapper(authController.signIn));
authRouter.post('/forgot-password', asyncWrapper(authController.forgotPassword));
authRouter.post('/reset-password', asyncWrapper(authController.resetPassword));

export default authRouter;
