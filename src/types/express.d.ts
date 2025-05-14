import { User } from './auth';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      file?: {
        path: string;
        mimetype: string;
        originalname: string;
      };
    }
  }
}

export {};