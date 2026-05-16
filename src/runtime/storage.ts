import {
  Filesystem,
  Directory,
  Encoding,
} from "@capacitor/filesystem";

export const AndroidStorage = {

  async save(
    path: string,
    data: string
  ) {

    await Filesystem.writeFile({

      path,

      data,

      directory:
        Directory.Documents,

      encoding:
        Encoding.UTF8,

      recursive: true,
    });

    return true;
  },

  async read(
    path: string
  ) {

    const result =
      await Filesystem.readFile({

        path,

        directory:
          Directory.Documents,

        encoding:
          Encoding.UTF8,
      });

    return result.data;
  },

  async remove(
    path: string
  ) {

    await Filesystem.deleteFile({

      path,

      directory:
        Directory.Documents,
    });

    return true;
  }
};