import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";

const sqlite =
  new SQLiteConnection(
    CapacitorSQLite
  );

let db:
  SQLiteDBConnection;

export async function initDB() {

  try {

    db =
      await sqlite.createConnection(
        "appdb",
        false,
        "no-encryption",
        1,
        false
      );

    await db.open();

    // CREATE TABLE

    await db.execute(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT
      );
    `);

    return true;

  } catch (error) {

    console.log(error);

    return false;
  }
}

export async function addNote(

  title: string,

  content: string

) {

  try {

    await db.run(
      `
      INSERT INTO notes
      (title, content)

      VALUES (?, ?)
      `,
      [title, content]
    );

    return true;

  } catch (error) {

    console.log(error);

    return false;
  }
}

export async function getNotes() {

  try {

    const result =
      await db.query(
        `
        SELECT * FROM notes
        ORDER BY id DESC
        `
      );

    return result.values || [];

  } catch (error) {

    console.log(error);

    return [];
  }
}

export async function deleteNote(
  id: number
) {

  try {

    await db.run(
      `
      DELETE FROM notes
      WHERE id = ?
      `,
      [id]
    );

    return true;

  } catch (error) {

    console.log(error);

    return false;
  }
}