export const AUTH_STACK = {
  LOGIN: {NAME: 'LoginScreen', TITLE: '로그인 화면'},
  TEST_LOGIN: {NAME: 'TestLoginScreen', TITLE: '소셜로그인 화면'},
  MAIN: {NAME: 'MainScreen', TITLE: '메인 화면'},
  REGISTER: {NAME: 'RegisterScreen', TITLE: '회원등록 화면'},
} as const;

export type AuthStackParams = {
  [KEY in keyof typeof AUTH_STACK as (typeof AUTH_STACK)[KEY]['NAME']]: undefined;
};
