import { Obstacle } from './SaveRouteQuery';
import * as assets from '../pages/save-edit-route/assets'

export type GetRoutesResponse = {
  createdAt: string;
  updatedAt: string;
  route: string;
  id: number;
  userId: number;
  isApproved: boolean;
  icon: string;
  images: {
    path: string;
  }[];
  obstacle: Obstacle;
  description: string;
  dislikedUsers: {
    id: number;
  }[];
  likedUsers: {
    id: number;
  }[];
};

export type GetRouteByIdResponse = {
  author: {
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  route: string;
  id: number;
  userId: number;
  description: string;
  isApproved: boolean;
  icon: string;
  obstacle: Obstacle;
  images: {
    path: string;
  }[];
  dislikedUsers: {
    id: number;
  }[];
  likedUsers: {
    id: number;
  }[];
};

export type DeleteRoute = {
    routeId: number;
}

export type DeleteRouteResponse = {
    data: number;
}
