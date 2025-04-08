import {useRef} from 'react';
import CustomWebview from '../../../components/atoms/webview/custom-webview';

const MainScreen = () => {
  const webRef = useRef(null);

  return (
    <>
      <CustomWebview webRef={webRef} uri={'ko'} />
    </>
  );
};

export default MainScreen;
