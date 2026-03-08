import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourapp.id',
  appName: 'YourApp',
  webDir: 'build',
  server: {
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;