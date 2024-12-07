/*
  Warnings:

  - A unique constraint covering the columns `[googleBooksId]` on the table `UserBook` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserBook_googleBooksId_key" ON "UserBook"("googleBooksId");
