import React, {useEffect} from 'react';
import {Button, View} from 'react-native';

// [구글 로그인 관련]
import {GoogleSignin} from '@react-native-google-signin/google-signin';

// [카카오 로그인 관련]
import {
  getProfile,
  loginWithKakaoAccount,
} from '@react-native-seoul/kakao-login';

// [네이버 로그인 관련]
import NaverLogin from '@react-native-seoul/naver-login';

import {useDispatch} from 'react-redux';
import {setAuthorizationToken} from '../../../api/authorize-axios';
import {setUser} from '../../../redux/reducers/user-reducer';

import {AuthApi} from '../../../api/auth/auth.api';
import {UserApi} from '../../../api/user/user.api';

// [네비게이션 관련]
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AUTH_STACK,
  AuthStackParams,
} from '../../../constants/navigator/navigator';
import {OAUTH_PROVIDER} from '../../../constants/common';
import {setProvider, setProviderId} from '../../../redux/reducers/auth-reducer';

// iOS용 구글 클라이언트 ID
const IOS_GOOGLE_CLIENT_ID =
  '448611556147-30o1nrq5akocrtmbqriu2gcuvsjioo3v.apps.googleusercontent.com';

// 네이버 로그인에 필요한 정보
const NAVER_APP_NAME = 'mokjang';
const NAVER_CONSUMER_KEY = 'fQHH1hsqVpucKd7R2CDS';
const NAVER_CONSUMER_SECRET = 'TvZmIAB0D6';
const NAVER_SERVICE_URL_SCHEME_IOS = 'mokjang';

// 네비게이션 타입
type TestLoginScreenProps = NativeStackScreenProps<
  AuthStackParams,
  typeof AUTH_STACK.LOGIN.NAME
>;

const TestLoginScreen = ({navigation}: TestLoginScreenProps) => {
  const dispatch = useDispatch();
  const authApi = new AuthApi(false);
  const userApi = new UserApi(false);

  // -------------------------
  // Google & Naver 초기 설정
  // -------------------------
  useEffect(() => {
    // [1] 구글 설정
    GoogleSignin.configure({
      iosClientId: IOS_GOOGLE_CLIENT_ID,
    });

    // [2] 네이버 설정
    NaverLogin.initialize({
      appName: NAVER_APP_NAME,
      consumerKey: NAVER_CONSUMER_KEY,
      consumerSecret: NAVER_CONSUMER_SECRET,
      serviceUrlSchemeIOS: NAVER_SERVICE_URL_SCHEME_IOS,
      disableNaverAppAuthIOS: true,
    });
  }, []);

  // -----------------------------------------------------------
  // 공통 함수: provider( Google/Kakao/Naver )만 달라지도록 통일
  // -----------------------------------------------------------
  const handleOAuthLogin = async (provider: OAUTH_PROVIDER) => {
    try {
      let providerId: string | undefined;

      // -------------------------
      // 1) 프로바이더별 로그인 절차
      // -------------------------
      if (provider === OAUTH_PROVIDER.GOOGLE) {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log('[Google] userInfo: ', userInfo);

        // 구글 프로필 ID (일반적으로 user.id는 null일 가능성 낮음)
        providerId = userInfo.data?.user.id;

        // 사용자가 로그인 취소(statusCodes.SIGN_IN_CANCELLED) 등에 대한 별도 처리
      } else if (provider === OAUTH_PROVIDER.KAKAO) {
        const result = await loginWithKakaoAccount();
        console.log('[Kakao] login result: ', result);

        const profile = await getProfile();
        console.log('[Kakao] profile: ', profile);

        providerId = profile.id?.toString();
      } else if (provider === OAUTH_PROVIDER.NAVER) {
        const result = await NaverLogin.login();
        console.log('[Naver] login result: ', result);

        if (result.successResponse) {
          const naverProfile = await NaverLogin.getProfile(
            result.successResponse.accessToken,
          );
          console.log('[Naver] profile: ', naverProfile);

          providerId = naverProfile.response?.id?.toString();
        } else {
          // 로그인 실패 또는 사용자가 취소한 경우
          console.log('[Naver] 로그인 실패 또는 취소');
          return;
        }
      }

      if (!providerId) {
        console.warn(`[${provider}] providerId를 찾을 수 없음.`);
        return;
      }

      // -------------------------
      // 2) 서버 연동 (getMobileAuth)
      // -------------------------
      const response = await authApi.getMobileAuth({
        provider,
        providerId,
      });
      console.log('providerId', providerId);

      console.log(`[Server(${provider})] response: `, response.data);

      // -------------------------
      // 3) 서버 응답 확인 후 처리
      // -------------------------
      if (response.data.accessToken) {
        // 토큰 설정 -> 사용자 정보 조회 -> 메인 화면 이동
        await setAuthorizationToken({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });

        const userResponse = await userApi.getUser();
        if (userResponse.data) {
          dispatch(setUser(userResponse.data));
          navigation.navigate(AUTH_STACK.MAIN.NAME);
        }
      } else if (response.data.temporal) {
        // 임시 토큰 존재 시 → 회원가입(등록) 화면으로 이동
        console.log(
          `[${provider}] TemporalToken 발견. 회원가입 화면으로 이동.`,
        );
        dispatch(setProvider(provider));
        dispatch(setProviderId(providerId));
        await setAuthorizationToken({
          temporalToken: response.data.temporal,
        });
        navigation.navigate(AUTH_STACK.REGISTER.NAME);
      }
    } catch (error: any) {}
  };

  return (
    <View
      style={{justifyContent: 'center', alignItems: 'center', height: '100%'}}>
      {/* 각각의 버튼에서 provider를 다르게 전달 */}
      <Button
        title="구글 로그인"
        onPress={() => handleOAuthLogin(OAUTH_PROVIDER.GOOGLE)}
      />
      <Button
        title="카카오 로그인"
        onPress={() => handleOAuthLogin(OAUTH_PROVIDER.KAKAO)}
      />
      <Button
        title="네이버 로그인"
        onPress={() => handleOAuthLogin(OAUTH_PROVIDER.NAVER)}
      />
    </View>
  );
};

export default TestLoginScreen;
