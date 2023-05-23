import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export type TabNavParamList = {
  MyRoutes: {
    userId: number,
  },
  RoutesToApprove: undefined,
  DangerRoutes: undefined,
};

const Tab = createBottomTabNavigator<TabNavParamList>();

export default function AccountRoutesList() {
  return (
    <View>
      <Text>AccountRoutesList</Text>
    </View>
  );
}
