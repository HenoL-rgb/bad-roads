import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyRoutes from '../components/MyRoutes';
import RoutesToApprove from '../components/RoutesToApprove';
import DangerRoutes from '../components/DangerRoutes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabNavParamList } from '../components/AppWrapper';
import { useAppSelector } from '../hooks/redux-hooks';
import AllRoutes from '../components/AllRoutes';

export type RoutesTabNavParamList = {
  MyRoutes: {
    userId: number;
  };
};

export type AdminRoutesTabNavParamList = {
  Routes: undefined;
  RoutesToApprove: undefined;
  DangerRoutes: undefined;
};

const Tab = createMaterialTopTabNavigator<RoutesTabNavParamList>();
const AdminTab = createMaterialTopTabNavigator<AdminRoutesTabNavParamList>();

function AdminNavigator() {
  return (
    <AdminTab.Navigator initialRouteName="Routes">
      <AdminTab.Screen
        name="Routes"
        component={AllRoutes}
        options={{
          title: 'Routes',
        }}
      />
      <AdminTab.Screen
        name="RoutesToApprove"
        component={RoutesToApprove}
        options={{
          title: 'Approve',
        }}
      />
      <AdminTab.Screen
        name="DangerRoutes"
        component={DangerRoutes}
        options={{
          title: 'Danger',
        }}
      />
    </AdminTab.Navigator>
  );
}

function UserNavigator({ userId }: { userId: number }) {
  return (
    <Tab.Navigator initialRouteName="MyRoutes">
      <Tab.Screen
        name="MyRoutes"
        component={MyRoutes}
        options={{
          title: 'My Routes',
        }}
        initialParams={{
          userId: userId,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AccountRoutesList() {
  const user = useAppSelector(state => state.userReducer.user);
  const isAdmin = user?.roles.find(
    (item: { value: string; description: string }) => item.value === 'ADMIN',
  );

  return isAdmin ? (
    <AdminNavigator />
  ) : (
    <UserNavigator userId={user ? user.id : 0} />
  );
}
