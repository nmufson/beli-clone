/*
  Warnings:

  - Added the required column `bookImageUrl` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "bookImageUrl" TEXT NOT NULL,
ALTER COLUMN "userRating" DROP NOT NULL;
