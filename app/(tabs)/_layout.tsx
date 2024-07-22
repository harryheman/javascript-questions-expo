import { Tabs } from 'expo-router'
import React from 'react'

import { TabBarIcon } from '@/components/navigation/TabBarIcon'
import { MD2Colors } from 'react-native-paper'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: MD2Colors.blue600,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Главная',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='dashboard'
        options={{
          title: 'Рекорды',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'medal' : 'medal-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}
