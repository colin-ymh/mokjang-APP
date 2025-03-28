import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';

import WebView, {
  WebViewMessageEvent,
  WebViewProps,
} from '@dr.pogodin/react-native-webview';

interface CustomWebviewProps extends WebViewProps {
  webRef: React.RefObject<WebView>;
  uri: string;
  onMessage?: (event: object) => void;
}

const CustomWebview = ({
  webRef,
  uri,
  onMessage,
  ...webViewProps
}: CustomWebviewProps): React.JSX.Element => {
  const metaTagInjection = `
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    document.head.appendChild(meta);
    true;
`;

  const getMessage = (msg: WebViewMessageEvent): object => {
    return JSON.parse(msg.nativeEvent.data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webRef}
        style={styles.webview}
        source={{uri: `http://192.168.0.171:3001/${uri}`}}
        // source={{uri: `http://localhost:3000/${uri}`}}
        injectedJavaScript={metaTagInjection}
        onMessage={msg => {
          if (onMessage) {
            onMessage(getMessage(msg));
          }
        }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.log('WebView error: ', nativeEvent);
        }}
        {...webViewProps}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default CustomWebview;
