import { AndroidStorage }
from "./storage";

import { AndroidDB }
from "./database";

import { AndroidShare }
from "./share";

import { AndroidDevice }
from "./device";

import { AndroidNetwork }
from "./network";

declare global {

  interface Window {

    AndroidStorage: any;

    AndroidDB: any;

    AndroidShare: any;

    AndroidDevice: any;

    AndroidNetwork: any;
  }
}

export async function initBridge() {

  window.AndroidStorage =
    AndroidStorage;

  window.AndroidDB =
    AndroidDB;

  window.AndroidShare =
    AndroidShare;

  window.AndroidDevice =
    AndroidDevice;

  window.AndroidNetwork =
    AndroidNetwork;

  // INIT SQLITE

try {

  await AndroidDB.init();

} catch (error) {

  console.log(
    "SQLite only works on Android APK"
  );
}


}