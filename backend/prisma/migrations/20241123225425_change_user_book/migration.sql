/*
  Warnings:

  - Made the column `userReaction` on table `UserBook` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserBook" ALTER COLUMN "userReaction" SET NOT NULL;
