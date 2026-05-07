import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
        tabBarInactiveTintColor: "#a89f85",
        tabBarStyle: {
          backgroundColor: "#0f1a12",
          borderTopColor: "#2d4a33",
        },
        headerStyle: { backgroundColor: "#0f1a12" },
        headerTintColor: "#f0ead8",
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home", tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} /> }}
      />
      <Tabs.Screen
        name="teach"
        options={{ title: "Teach", tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: "Chat", tabBarIcon: ({ color }) => <TabBarIcon name="comment" color={color} /> }}
      />
      <Tabs.Screen
        name="dataset"
        options={{ title: "Dataset", tabBarIcon: ({ color }) => <TabBarIcon name="database" color={color} /> }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: "More", tabBarIcon: ({ color }) => <TabBarIcon name="ellipsis-h" color={color} /> }}
      />
    </Tabs>
  );
}