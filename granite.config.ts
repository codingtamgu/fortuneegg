import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'fortuneeggs',
  brand: {
    displayName: '포츈에그',
    primaryColor: '#C9922F',
    icon: 'https://static.toss.im/appsintoss/23573/82188b10-e516-480a-8482-9cba04107f32.png',
  },
  permissions: [],
  web: {
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'tsc -b && vite build',
    },
  },
  webViewProps: {
    type: 'partner',
    overScrollMode: 'never',
    pullToRefreshEnabled: false,
    allowsBackForwardNavigationGestures: false,
  },
});
