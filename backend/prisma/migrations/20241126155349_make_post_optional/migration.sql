/*
  Warnings:

  - Added the required column `status` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userBookId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "status" "BookStatus" NOT NULL,
ADD COLUMN     "userBookId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserBook" ADD COLUMN     "makePost" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userBookId_fkey" FOREIGN KEY ("userBookId") REFERENCES "UserBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
