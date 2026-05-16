import {
  CapacitorSQLite,
  SQLiteConnection,
} from "@capacitor-community/sqlite";

const sqlite =
  new SQLiteConnection(
    CapacitorSQLite
  );

let db: any = null;

export const AndroidDB = {

  async init() {

    db =
      await sqlite.createConnection(
        "appdb",
        false,
        "no-encryption",
        1,
        false
      );

    await db.open();

    await db.execute(
`
CREATE TABLE IF NOT EXISTS notes (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT,
content TEXT
);
`
    );
  },

  async addNote(
    title: string,
    content: string
  ) {

    await db.run(
`
INSERT INTO notes
(title, content)
VALUES (?, ?)
`,
      [title, content]
    );

    return true;
  },

  async getNotes() {

    const result =
      await db.query(
`
SELECT * FROM notes
ORDER BY id DESC
`
      );

    return result.values;
  }
};