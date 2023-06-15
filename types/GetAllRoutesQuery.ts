import { Obstacle } from './SaveRouteQuery';

export type GetRoutesResponse = {
  createdAt: string;
  updatedAt: string;
  route: string;
  id: number;
  userId: number;
  isApproved: boolean;
  icon: string;
  images: string[];
  obstacle: Obstacle;
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
  isApproved: boolean;
  icon: string;
  images: string[];
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
