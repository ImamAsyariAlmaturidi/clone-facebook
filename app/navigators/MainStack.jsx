import Home from "../screens/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();
export default function MainStack() {
  return (
    <Stack.Navigator
      initialRouteName="MainStack"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={"Home"} component={Home} />
    </Stack.Navigator>
  );
}
