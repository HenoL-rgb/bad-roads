import { Point } from "./Point";

export type Route = {
  route: Point[];
  id: number;
  userId: number;
  isApproved: boolean
};

export type DataRoute = {
    route: string;
    id: number;
    userId: number;
}

export type MapCurrentRoute = {
    start: Point | null,
    end: Point | null,
    id: number,
}

export type RouteSection = {
  points: Point[];

  transports: {
    [key: string]: string;
  };

  type: string;
  stops: [];
  routeIndex: number;
  routeInfo: {
    distance: number;
    time: string;
    timeWithTraffic: string;
  };
  sectionInfo: {
    distance: number;
    time: string;
    timeWithTraffic: string;
  };
  sectionColor: string;
};
