import { GetRoutesResponse } from "../types/GetAllRoutesQuery";
import { Route } from "../types/Route";
import { SaveRouteResponse } from "../types/SaveRouteQuery";

export function transformRoute(routeData: SaveRouteResponse): Route {
    return {
        ...routeData,
        route: JSON.parse(routeData.route),
      }
}