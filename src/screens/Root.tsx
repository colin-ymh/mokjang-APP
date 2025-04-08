import AuthStackNav from '../navigators/auth-stack-nav';
import {NavigationContainer} from '@react-navigation/native';

import {Provider} from 'react-redux';
import Store from '../redux/store';

const Root = () => {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <AuthStackNav />
      </NavigationContainer>
    </Provider>
  );
};

export default Root;
