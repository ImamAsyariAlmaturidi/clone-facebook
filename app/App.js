import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as eva from "@eva-design/eva";
import Register from "./screens/Register";
import Login from "./screens/Login";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApplicationProvider } from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ApolloProvider } from "@apollo/client";
import { authContext } from "./context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "./config/apolloClient";
import { StatusBar } from "expo-status-bar";
import Home from "./screens/Home";
import MainStack from "./navigators/MainStack";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      setIsLogin(!!token);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ApolloProvider client={client}>
      <authContext.Provider value={{ isLogin, setIsLogin }}>
        <ApplicationProvider {...eva} theme={eva.dark}>
          <SafeAreaProvider>
            <StatusBar style="auto" />
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLogin ? (
                  <Stack.Screen name="MainStack" component={MainStack} />
                ) : (
                  <>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Register" component={Register} />
                  </>
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </ApplicationProvider>
      </authContext.Provider>
    </ApolloProvider>
  );
}
