import { Application } from 'express';
import authRouter from '~/features/user/routes/auth.router';
import userRouter from '~/features/user/routes/user.router';

function appRoutes(app: Application) {
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/auth', authRouter);
}

export default appRoutes;
