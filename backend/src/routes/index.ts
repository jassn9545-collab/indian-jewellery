import  { Express } from 'express';
import { authRoute } from './authRoute';
import { userRoute } from './userRoute';


export const configureRoutes = (app: Express): void => {

  const apiPrefix = '/api_v1';

  app.use(`${apiPrefix}/auth`, authRoute());
  app.use(`${apiPrefix}/user`, userRoute());

};