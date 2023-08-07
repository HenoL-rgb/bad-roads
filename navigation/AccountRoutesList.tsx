import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyRoutes from '../components/account-page/MyRoutes';
import RoutesToApprove from '../components/account-page/RoutesToApprove';
import DangerRoutes from '../components/DangerRoutes';

import { useAppSelector } from '../hooks/redux-hooks';
import AllRoutes from '../components/AllRoutes';
import { Theme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

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

function AdminNavigator({ theme }: { theme: Theme }) {
  const { t } = useTranslation();
  return (
    <AdminTab.Navigator
      initialRouteName="Routes"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        tabBarActiveTintColor: theme.colors.text,
      }}>
      <AdminTab.Screen
        name="Routes"
        component={AllRoutes}
        options={{
          title: t('routes'),
        }}
      />
      <AdminTab.Screen
        name="RoutesToApprove"
        component={RoutesToApprove}
        options={{
          title: t('approve'),
        }}
      />
      <AdminTab.Screen
        name="DangerRoutes"
        component={DangerRoutes}
        options={{
          title: t('danger'),
        }}
      />
    </AdminTab.Navigator>
  );
}

function UserNavigator({ userId, theme }: { userId: number; theme: Theme }) {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName="MyRoutes"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        tabBarActiveTintColor: theme.colors.text,
      }}>
      <Tab.Screen
        name="MyRoutes"
        component={MyRoutes}
        options={{
          title: t('myRoutes'),
        }}
        initialParams={{
          userId: userId,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AccountRoutesList({ theme }: { theme: Theme }) {
  const user = useAppSelector(state => state.userReducer.user);
  const isAdmin = user?.roles.find(
    (item: { value: string; description: string }) => item.value === 'ADMIN',
  );

  return isAdmin ? (
    <AdminNavigator theme={theme} />
  ) : (
    <UserNavigator userId={user ? user.id : 0} theme={theme} />
  );
}
