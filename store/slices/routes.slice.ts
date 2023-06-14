import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Point } from '../../types/Point';
import { MapCurrentRoute, Route } from '../../types/Route';

enum modes {
  IDLE,
  ADD,
  EDIT,
  CREATE,
  ROUTE_ADDED,
  ROUTE_APPROVED,
}

enum currentMarker {
  START,
  END,
}

interface RoutesData {
  mode: number;
  markersVisible: MarkersVisible;
  currentMarker: number;
  currentRoute: MapCurrentRoute;
  points: Point[];
  routes: Route[];
}

interface MarkersVisible {
  start: boolean;
  end: boolean;
}

interface Like {
  routeId: number;
  user: {
    id: number;
  }
}

const initialState: RoutesData = {
  mode: modes.IDLE,
  markersVisible: {
    start: false,
    end: false,
  },
  currentMarker: currentMarker.START,
  currentRoute: {
    start: null,
    end: null,
    id: 0,
  },
  points: [],
  routes: [],
};

export const routesSlice = createSlice({
  initialState,
  name: 'routes',
  reducers: {
    setMode(state, action: PayloadAction<number>) {
      state.mode = action.payload;
    },
    setMarkersVisible(state, action: PayloadAction<MarkersVisible>) {
      state.markersVisible = action.payload;
    },
    setCurrentMarker(state, action: PayloadAction<number>) {
      state.currentMarker = action.payload;
    },
    setCurrentRoute(state, action: PayloadAction<MapCurrentRoute>) {
      state.currentRoute = action.payload;
    },
    setPoints(state, action: PayloadAction<Point[]>) {
      state.points = action.payload;
    },
    setRoutes(state, action: PayloadAction<Route[]>) {
      state.routes = action.payload;
    },
    setLike(state, action: PayloadAction<Like>) {
      state.routes = [...state.routes].map(item => {

        //Remove if like exist
        if(item.id === action.payload.routeId) {
          return {
            ...item,
            likedUsers: [...item.likedUsers, action.payload.user]
          }
        }
        return item;
      })
    },
    setDislike(state, action: PayloadAction<Like>) {
      state.routes = [...state.routes].map(item => {
        if(item.id === action.payload.routeId) {
          return {
            ...item,
            dislikedUsers: [...item.dislikedUsers, action.payload.user]
          }
        }
        return item;
      })
    },
    setInitialState(state) {
      return { ...initialState, routes: state.routes };
    },
  },
});

export const {
  setMode,
  setMarkersVisible,
  setCurrentMarker,
  setCurrentRoute,
  setInitialState,
  setPoints,
  setRoutes,
  setLike,
  setDislike
} = routesSlice.actions;
export default routesSlice.reducer;
