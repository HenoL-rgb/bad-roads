import { createSlice } from "@reduxjs/toolkit";
import { Point } from "../../types/Point";

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
    mode: number,
    markersVisible: {
        start: boolean,
        end: boolean
    },
    currentMarker: number,
    currentRoute: {
        start: Point | null,
        end: Point | null,
        id: number
    },
    points: Point[]
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
};

export const routesSlice = createSlice({
    initialState,
    name: 'routes',
    reducers: {
        setMode(state, action) {
            state.mode = action.payload
        },
        setMarkersVisible(state, action) {
            state.markersVisible = {...action.payload}
        },
        setCurrentMarker(state, action) {
            state.currentMarker = action.payload
        },
        setCurrentRoute(state, action) {
            state.currentRoute = {...action.payload}
        },
        setPoints(state, action) {
            state.points = [...action.payload]
        },
        setInitialState() {
            return {...initialState};
        }
    }
})

export const {setMode, setMarkersVisible, setCurrentMarker, setCurrentRoute, setInitialState, setPoints} = routesSlice.actions;
export default routesSlice.reducer
