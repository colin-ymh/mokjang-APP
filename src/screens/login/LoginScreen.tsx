import React, {useState} from 'react';
import {View, TextInput, Pressable, Text, StyleSheet} from 'react-native';

import {BLANK} from '../../constants/constant';
import {AuthApi} from '../../api/auth/auth.api';
import {setAuthorizationToken} from '../../api/authorize-axios';
import {UserApi} from '../../api/user/user.api';
import axios from 'axios';
import {TEST_SERVER_URL} from '../../constants/url';

const TestLoginScreen = () => {
  const authApi = new AuthApi(false);
  const userApi = new UserApi(false);

  const [userId, setUserId] = useState<string>(BLANK);
  const [userPassword, setUserPassword] = useState<string>(BLANK);

  const onPressLogin = async () => {
    try {
      // await axios.get(`${TEST_SERVER_URL}/error/internal-server`);
      const response = await authApi.getTestAuth({
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

export default TestLoginScreen;
