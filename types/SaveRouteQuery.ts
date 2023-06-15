import { Point } from './Point';

export type SaveRoute = {
  route: Point[];
  icon: string;
  userId: number;
};

export type SaveRouteResponse = {
  createdAt: string;
  icon: string;
  id: number;
  isApproved: boolean;
  route: string;
  updatedAt: string;
  userId: number;
  images: string[];
  dislikedUsers: {
    id: number;
  }[];
  likedUsers: {
    id: number;
  }[];
};
