import * as assets from '../pages/save-edit-route/assets';

import { Point } from './Point';

export type UpdateRoute = {
  route: Point[];
  icon: string;
  routeId: number;
  userId: number;
  obstacleId: number;
  description: string;
  images: (string | { path: string })[];
};

export type UpdateRouteResponse = {
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
};
