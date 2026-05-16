import {
  Network
} from "@capacitor/network";

export const AndroidNetwork = {

  async isOnline() {

    const status =
      await Network.getStatus();

    return status.connected;
  }
};