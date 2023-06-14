export type MarkRoute = {
    userId: number;
    routeId: number;
}

export type MarkRouteResponse = {
    data: {
        createdAt: string;
        routeId: number;
        updatedAt: string;
        userId: number;
    }
}

