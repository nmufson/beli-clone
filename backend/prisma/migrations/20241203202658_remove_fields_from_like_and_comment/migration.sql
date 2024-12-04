/*
  Warnings:

  - You are about to drop the column `userFirstName` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userLastName` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userProfilePictureUrl` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userFirstName` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `userLastName` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `userProfilePictureUrl` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `userFirstName` on the `UserBook` table. All the data in the column will be lost.
  - You are about to drop the column `userLastName` on the `UserBook` table. All the data in the column will be lost.
  - You are about to drop the column `userProfilePictureUrl` on the `UserBook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "userFirstName",
DROP COLUMN "userLastName",
DROP COLUMN "userProfilePictureUrl";

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "userFirstName",
DROP COLUMN "userLastName",
DROP COLUMN "userProfilePictureUrl";

-- AlterTable
ALTER TABLE "UserBook" DROP COLUMN "userFirstName",
DROP COLUMN "userLastName",
DROP COLUMN "userProfilePictureUrl";
