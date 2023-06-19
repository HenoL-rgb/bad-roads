import { Point } from './Point';

export type SaveRoute = {
  route: Point[];
  icon: string;
  userId: number;
  obstacleId: number;
  description: string;
  images: string[];
};

export type SaveRouteResponse = {
  createdAt: string;
  icon: string;
  id: number;
  isApproved: boolean;
  route: string;
  updatedAt: string;
  userId: number;
  images: {
    path: string;
  }[];
  description: string;
  obstacle: Obstacle;
  dislikedUsers: {
    id: number;
  }[];
  likedUsers: {
    id: number;
  }[];
};

export type Obstacle = {
  icon: string;
  id: number;
  description: string;
}