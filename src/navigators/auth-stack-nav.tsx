import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth-stack/login/LoginScreen';
import MainScreen from '../screens/auth-stack/main/MainScreen';
import TestLoginScreen from '../screens/auth-stack/login/TestLoginScreen';
import {AUTH_STACK, AuthStackParams} from '../constants/navigator/navigator';
import RegisterScreen from '../screens/auth-stack/register/RegisterScreen';

const Stack = createNativeStackNavigator<AuthStackParams>();

type AuthStackNavProps = {};

const AuthStackNav = ({}: AuthStackNavProps) => {
  return (
    <Stack.Navigator
      initialRouteName={AUTH_STACK.TEST_LOGIN.NAME}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={AUTH_STACK.LOGIN.NAME} component={LoginScreen} />
      <Stack.Screen
        // @ts-ignore
        name={AUTH_STACK.TEST_LOGIN.NAME}
        component={TestLoginScreen}
      />
      <Stack.Screen
        name={AUTH_STACK.REGISTER.NAME}
        component={RegisterScreen}
      />
      <Stack.Screen name={AUTH_STACK.MAIN.NAME} component={MainScreen} />
    </Stack.Navigator>
  );
};

export default AuthStackNav;
