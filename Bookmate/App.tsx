import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SearchScreen } from "./screens/SearchScreen";
import { BookDetailsScreen } from "./screens/BookDetailsScreen";
import { RootStackParamList } from "./types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Search">
        <Stack.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ title: "Book Search" }}
        />
        <Stack.Screen 
          name="BookDetails" 
          component={BookDetailsScreen} 
          options={{ title: "Book Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
