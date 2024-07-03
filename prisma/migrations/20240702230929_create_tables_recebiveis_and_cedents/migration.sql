-- CreateTable
CREATE TABLE "recebiveis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "emissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cedentId" TEXT NOT NULL,
    CONSTRAINT "recebiveis_cedentId_fkey" FOREIGN KEY ("cedentId") REFERENCES "cedents" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cedents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "document" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
