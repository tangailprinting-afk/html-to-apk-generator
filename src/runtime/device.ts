import {
  Device
} from "@capacitor/device";

export const AndroidDevice = {

  async getInfo() {

    return await Device.getInfo();
  }
};