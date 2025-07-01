import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, MainTabParamList } from '../types';
import { COLORS } from '../constants';

// Screens
import ExploreScreen from '../screens/explore/ExploreScreen';
import WatchlistScreen from '../screens/watchlist/WatchlistScreen';
import ProductScreen from '../screens/product/ProductScreen';
import ViewAllScreen from '../screens/viewall/ViewAllScreen';
import SearchScreen from '../screens/search/SearchScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Explore') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Watchlist') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.surface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{
          title: 'Stocks App',
        }}
      />
      <Tab.Screen 
        name="Watchlist" 
        component={WatchlistScreen}
        options={{
          title: 'Watchlist',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProductScreen" 
          component={ProductScreen}
          options={({ route }) => ({
            title: route.params.name,
          })}
        />
        <Stack.Screen 
          name="ViewAllScreen" 
          component={ViewAllScreen}
          options={({ route }) => ({
            title: route.params.title,
          })}
        />
        <Stack.Screen 
          name="SearchScreen" 
          component={SearchScreen}
          options={{
            title: 'Search Stocks',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}