import { Point } from "react-native-yamap";

export type UpdateRouteResponse = {
  data: number[];
};

export type UpdateRoute = {
  points: Point[];
  icon: string;
  id: number;
};
