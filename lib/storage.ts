import {
  Filesystem,
  Directory,
  Encoding,
} from "@capacitor/filesystem";

export async function saveFile(

  path: string,

  data: string

) {

  try {

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

  } catch (error) {

    console.log(error);

    return false;
  }
}

export async function readFile(

  path: string

) {

  try {

    const result =
      await Filesystem.readFile({

        path,

        directory:
          Directory.Documents,

        encoding:
          Encoding.UTF8,
      });

    return result.data;

  } catch (error) {

    console.log(error);

    return null;
  }
}

export async function deleteFile(

  path: string

) {

  try {

    await Filesystem.deleteFile({

      path,

      directory:
        Directory.Documents,
    });

    return true;

  } catch (error) {

    console.log(error);

    return false;
  }
}

export async function createFolder(

  path: string

) {

  try {

    await Filesystem.mkdir({

      path,

      directory:
        Directory.Documents,

      recursive: true,
    });

    return true;

  } catch (error) {

    console.log(error);

    return false;
  }
}

export async function listFiles(

  path: string

) {

  try {

    const result =
      await Filesystem.readdir({

        path,

        directory:
          Directory.Documents,
      });

    return result.files;

  } catch (error) {

    console.log(error);

    return [];
  }
}