import { Route } from './Route';

export type Login = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type User = {
  id: number;
  email: string;
  banned: boolean;
  banReason: string;
  roles: {
    value: string;
    description: string;
  }[];
  likes: {
    id: number;
  }[];
  dislikes: {
    id: number;
  }[];
  createdAt: Date;
};
