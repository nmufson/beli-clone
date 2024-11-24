/*
  Warnings:

  - Changed the type of `googleBooksId` on the `UserBook` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "UserBook" DROP COLUMN "googleBooksId",
ADD COLUMN     "googleBooksId" INTEGER NOT NULL;
