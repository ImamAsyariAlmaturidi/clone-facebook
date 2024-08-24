import Home from "../screens/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/Profile";
import Detail from "../screens/Detail";
import { Button } from "@ui-kitten/components";
import {
  Directions,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { GestureDetectorProvider } from "react-native-screens/gesture-handler";

const Stack = createNativeStackNavigator();
export default function MainStack() {
  const config = {
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <GestureHandlerRootView>
      <GestureDetectorProvider>
        <Stack.Navigator
          screenOptions={{
            gestureEnabled: true,
            gestureDirection: "horizontal",
            animation: "fade_from_bottom",
            headerShown: true,
            animationDuration: 400,
            fullScreenGestureShadowEnabled: true,
          }}
        >
          <Stack.Screen
            name={"Home"}
            component={Home}
            options={{
              headerShown: false,
              transitionSpec: {
                open: config,
                close: config,
              },
              goBackGesture: "swipeLeft",
            }}
          />
          <Stack.Screen
            name={"Profile"}
            component={Profile}
            screenOptions={{ headerShown: true }}
            options={{
              headerBackTitleVisible: false,
              headerTitle: "",
              transitionSpec: {
                headerShown: false,
                open: config,
                close: config,
              },
            }}
          />
          <Stack.Screen
            name={"Detail"}
            component={Detail}
            options={{
              headerBackTitleVisible: false,
              headerTitle: "",
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
          />
        </Stack.Navigator>
      </GestureDetectorProvider>
    </GestureHandlerRootView>
  );
}
