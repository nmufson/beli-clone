/*
  Warnings:

  - You are about to drop the column `status` on the `FollowRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FollowRequest" DROP COLUMN "status";

-- DropEnum
DROP TYPE "FollowRequestStatus";
