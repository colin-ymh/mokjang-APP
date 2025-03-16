import {useRef} from 'react';
import CustomWebview from './components/atoms/webview/custom-webview';

const Root = () => {
  const webRef = useRef(null);

  return (
    <>
      <CustomWebview webRef={webRef} uri={''} />
    </>
  );
};

export default Root;
