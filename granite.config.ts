import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'fortuneeggs',
  brand: {
    displayName: '포츈에그',
    primaryColor: '#C9922F',
    icon: 'https://codingtamgu.github.io/fortuneegg/app-logo-600.png',
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
