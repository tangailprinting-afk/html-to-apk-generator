
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.newnew.app",
  appName: "new",
  webDir: "public",

  plugins: {
    OneSignal: {
      appId:
        "cf9a26bb-42ee-439b-a8d1-bb3ca6ca6d06",
    },
  },
};

export default config;
