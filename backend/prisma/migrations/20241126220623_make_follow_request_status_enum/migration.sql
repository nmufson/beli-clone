/*
  Warnings:

  - The `status` column on the `FollowRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FollowRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "FollowRequest" DROP COLUMN "status",
ADD COLUMN     "status" "FollowRequestStatus" NOT NULL DEFAULT 'PENDING';
