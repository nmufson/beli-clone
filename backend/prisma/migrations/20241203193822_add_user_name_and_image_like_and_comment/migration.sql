/*
  Warnings:

  - Made the column `userFirstName` on table `UserBook` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userLastName` on table `UserBook` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userProfilePictureUrl` on table `UserBook` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "userFirstName" TEXT,
ADD COLUMN     "userLastName" TEXT,
ADD COLUMN     "userProfilePictureUrl" TEXT;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "userFirstName" TEXT,
ADD COLUMN     "userLastName" TEXT,
ADD COLUMN     "userProfilePictureUrl" TEXT;

-- AlterTable
ALTER TABLE "UserBook" ALTER COLUMN "userFirstName" SET NOT NULL,
ALTER COLUMN "userLastName" SET NOT NULL,
ALTER COLUMN "userProfilePictureUrl" SET NOT NULL;
