import {
  Share
} from "@capacitor/share";

export const AndroidShare = {

  async share(
    title: string,
    text: string
  ) {

    await Share.share({

      title,

      text,
    });

    return true;
  }
};