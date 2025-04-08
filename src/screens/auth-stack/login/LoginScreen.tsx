import React, {useState} from 'react';
import {View, TextInput, Pressable, Text, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';

import {AuthApi} from '../../../api/auth/auth.api';
import {setAuthorizationToken} from '../../../api/authorize-axios';
import {UserApi} from '../../../api/user/user.api';
import {BLANK} from '../../../constants/common';
import {
  AUTH_STACK,
  AuthStackParams,
} from '../../../constants/navigator/navigator';
import {setUser} from '../../../redux/reducers/user-reducer';

type LoginScreenProps = NativeStackScreenProps<
  AuthStackParams,
  typeof AUTH_STACK.LOGIN.NAME
>;

const LoginScreen = ({navigation}: LoginScreenProps) => {
  const authApi = new AuthApi(false);
  const userApi = new UserApi(false);

  const dispatch = useDispatch();

  const [userId, setUserId] = useState<string>(BLANK);
  const [userPassword, setUserPassword] = useState<string>(BLANK);

  const onPressLogin = async () => {
    try {
      // await axios.get(`${TEST_SERVER_URL}/error/internal-server`);
      const response = await authApi.getMobileAuth({
        provider: userId,
        providerId: userPassword,
      });

      console.log(response.data);
      if (response.data) {
        await setAuthorizationToken(
          response.data.accessToken,
          response.data.refreshToken,
        );

        const userResponse = await userApi.getUser();
        console.log(userResponse.data);

        if (userResponse.data) {
          dispatch(setUser(userResponse.data));
          navigation.navigate(AUTH_STACK.MAIN.NAME);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="User ID"
        value={userId}
        onChangeText={setUserId}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={userPassword}
        onChangeText={setUserPassword}
      />
      <Pressable
        onPress={onPressLogin}
        style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
