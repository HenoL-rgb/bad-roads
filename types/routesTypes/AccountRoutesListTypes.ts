export enum tabNavScreens {
  MyRoutes = 'MyRoutes',
}

export enum adminRoutesScreens {
  Routes = 'Routes',
  RoutesToApprove = 'RoutesToApprove',
  DangerRoutes = 'DangerRoutes',
}

export type RoutesTabNavParamList = {
  [tabNavScreens.MyRoutes]: {
    userId: number;
  };
};

export type AdminRoutesTabNavParamList = {
  [adminRoutesScreens.Routes]: undefined;
  [adminRoutesScreens.RoutesToApprove]: undefined;
  [adminRoutesScreens.DangerRoutes]: undefined;
};
