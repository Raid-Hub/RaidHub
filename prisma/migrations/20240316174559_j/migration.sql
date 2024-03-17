ALTER TABLE profile ADD COLUMN name2 TEXT NOT NULL DEFAULT 'name2';

CREATE TABLE "_migration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_applied" BOOLEAN NOT NULL,
    "applied_at" DATETIME NOT NULL
);
