/*
  Warnings:

  - Made the column `userFirstName` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userLastName` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userProfilePictureUrl` on table `Comment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userFirstName` on table `Like` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userLastName` on table `Like` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userProfilePictureUrl` on table `Like` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "userFirstName" SET NOT NULL,
ALTER COLUMN "userLastName" SET NOT NULL,
ALTER COLUMN "userProfilePictureUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "userFirstName" SET NOT NULL,
ALTER COLUMN "userLastName" SET NOT NULL,
ALTER COLUMN "userProfilePictureUrl" SET NOT NULL;
