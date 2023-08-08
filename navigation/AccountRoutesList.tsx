import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Theme } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../hooks/redux-hooks';
import AllRoutes from '../pages/Account/components/AllRoutes';
import DangerRoutes from '../pages/Account/components/DangerRoutes';
import MyRoutes from '../pages/Account/components/MyRoutes';
import RoutesToApprove from '../pages/Account/components/RoutesToApprove';
import {
  RoutesTabNavParamList,
  AdminRoutesTabNavParamList,
  adminRoutesScreens,
  tabNavScreens,
} from '../types/routesTypes/AccountRoutesListTypes';

const Tab = createMaterialTopTabNavigator<RoutesTabNavParamList>();
const AdminTab = createMaterialTopTabNavigator<AdminRoutesTabNavParamList>();

function AdminNavigator({ theme }: { theme: Theme }) {
  const { t } = useTranslation();
  return (
    <AdminTab.Navigator
      initialRouteName={adminRoutesScreens.Routes}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        tabBarActiveTintColor: theme.colors.text,
      }}>
      <AdminTab.Screen
        name={adminRoutesScreens.Routes}
        component={AllRoutes}
        options={{
          title: t('routes'),
        }}
      />
      <AdminTab.Screen
        name={adminRoutesScreens.RoutesToApprove}
        component={RoutesToApprove}
        options={{
          title: t('approve'),
        }}
      />
      <AdminTab.Screen
        name={adminRoutesScreens.DangerRoutes}
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
      initialRouteName={tabNavScreens.MyRoutes}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
        tabBarActiveTintColor: theme.colors.text,
      }}>
      <Tab.Screen
        name={tabNavScreens.MyRoutes}
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
