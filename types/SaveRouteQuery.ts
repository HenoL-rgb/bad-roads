import { Point } from './Point';
import * as assets from '../pages/save-edit-route/assets'

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
  icon: keyof typeof assets;
  id: number;
  description: string;
}