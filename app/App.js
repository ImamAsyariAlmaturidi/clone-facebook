import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import * as eva from '@eva-design/eva';
import Register from './screens/Register';
import Login from './screens/Login';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
import Home from './screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider } from '@ui-kitten/components';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function App() {
  const Tab = createMaterialTopTabNavigator();
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
    <ApplicationProvider {...eva} theme={eva.dark}>
      <SafeAreaProvider>
      <Stack.Navigator>
      {/* <Tab.Navigator> */}
      {/* <Stack.Screen name="Register" component={Register} /> */}
        <Stack.Screen name="Home" component={Home} />
      {/* </Tab.Navigator> */}
      {/* <Stack.Screen name="Login" component={Login} /> */}
      </Stack.Navigator>
      </SafeAreaProvider>
    </ApplicationProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
