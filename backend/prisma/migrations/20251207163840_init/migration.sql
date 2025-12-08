-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "groupType" TEXT,
    "status" TEXT NOT NULL
);
