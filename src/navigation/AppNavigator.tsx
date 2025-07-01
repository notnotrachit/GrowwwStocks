import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList, MainTabParamList } from "../types";
import useTheme from "../hooks/useTheme";

// Screens
import ExploreScreen from "../screens/explore/ExploreScreen";
import WatchlistScreen from "../screens/watchlist/WatchlistScreen";
import ProductScreen from "../screens/product/ProductScreen";
import ViewAllScreen from "../screens/viewall/ViewAllScreen";
import SearchScreen from "../screens/search/SearchScreen";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Explore") {
            iconName = focused ? "trending-up" : "trending-up-outline";
          } else if (route.name === "Watchlist") {
            iconName = focused ? "bookmark" : "bookmark-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: "#FFFFFF", // Force header icons and text to be white
        headerTitleStyle: {
          fontWeight: "bold",
          color: "#FFFFFF", // Explicitly set title color to white
        },
      })}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: "Home",
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{
          title: "Watchlist",
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: "#FFFFFF", // Force header text to be white
          border: colors.border,
          notification: colors.primary,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: "#FFFFFF", // Force header icons and text to be white
          headerTitleStyle: {
            fontWeight: "bold",
            color: "#FFFFFF", // Explicitly set title color to white
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
            title: "Search Stocks",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
