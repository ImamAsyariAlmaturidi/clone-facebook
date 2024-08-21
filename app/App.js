import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import * as eva from '@eva-design/eva';
import Register from './screens/Register';
import Login from './screens/Login';
import Home from './screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider } from '@ui-kitten/components';

export default function App() {
  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
          {/* Uncomment the component you want to render */}
          <Register />
          {/* <Login /> */}
          {/* <Home /> */}
        </View>
      </SafeAreaProvider>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
