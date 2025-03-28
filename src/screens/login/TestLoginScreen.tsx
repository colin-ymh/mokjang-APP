import React, {useEffect} from 'react';
import {View, Button} from 'react-native';

// [구글 로그인 관련]
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

// [카카오 로그인 관련]
import {
  getProfile,
  loginWithKakaoAccount,
} from '@react-native-seoul/kakao-login';

// [네이버 로그인 관련]
import NaverLogin from '@react-native-seoul/naver-login';

/**
 * iOS용 구글 클라이언트 ID
 * (Google Cloud Console > iOS용 클라이언트)
 */
const IOS_GOOGLE_CLIENT_ID =
  '448611556147-30o1nrq5akocrtmbqriu2gcuvsjioo3v.apps.googleusercontent.com';

const consumerKey = 'fQHH1hsqVpucKd7R2CDS';
const consumerSecret = 'TvZmIAB0D6';
const appName = 'mokjang';
const serviceUrlSchemeIOS = 'mokjang';

const TestLoginScreen = () => {
  // Google 초기 설정
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId: IOS_GOOGLE_CLIENT_ID,
      // 필요하다면 webClientId, offlineAccess 등 추가 설정
    });
  }, []);

  // 네이버 초기 설정
  useEffect(() => {
    NaverLogin.initialize({
      appName,
      consumerKey,
      consumerSecret,
      serviceUrlSchemeIOS,
      disableNaverAppAuthIOS: true,
    });
  }, []);

  // -------------------------
  // Google 로그인
  // -------------------------
  const onGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('[Google] userInfo: ', userInfo);
      // userInfo.idToken, userInfo.user.email, name, photo 등을 활용하여 서버에 전달
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.warn('[Google] 사용자가 로그인 취소');
      } else {
        console.error('[Google] 로그인 에러: ', error);
      }
    }
  };

  // -------------------------
  // Kakao 로그인
  // -------------------------
  const onKakaoLogin = async () => {
    try {
      // 카카오톡 앱 설치 여부와 상관없이 웹 계정 로그인 방식 사용
      const result = await loginWithKakaoAccount();
      console.log('[Kakao] login result: ', result);
      const profile = await getProfile();
      console.log('[Kakao] profile: ', profile);
      // result.accessToken, profile.email, nickname 등으로 서버 연동 처리 가능
    } catch (error) {
      console.error('[Kakao] login error: ', error);
    }
  };

  // -------------------------
  // Naver 로그인 (using @react-native-seoul/naver-login)
  // -------------------------
  const onNaverLogin = async () => {
    try {
      const response = await NaverLogin.login();
      console.log(response);

      if (response.successResponse) {
        const profileResult = await NaverLogin.getProfile(
          response.successResponse!.accessToken,
        );

        console.log(profileResult);
      }
    } catch (error) {
      console.error('[Naver] login error:', error);
    }
  };

  return (
    <View
      style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
      <Button title="구글 로그인" onPress={onGoogleLogin} />
      <Button title="카카오 로그인" onPress={onKakaoLogin} />
      <Button title="네이버 로그인" onPress={onNaverLogin} />
    </View>
  );
};

export default TestLoginScreen;
