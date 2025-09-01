import express from 'express';
import authController from '../controllers/auth.controller';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';

const authRouter = express.Router();

authRouter.post('/signup', asyncWrapper(authController.signUp));
authRouter.post('/signin', asyncWrapper(authController.signIn));

export default authRouter;
