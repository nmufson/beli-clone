/*
  Warnings:

  - A unique constraint covering the columns `[postId,commentId,userId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Like_postId_commentId_userId_key" ON "Like"("postId", "commentId", "userId");
