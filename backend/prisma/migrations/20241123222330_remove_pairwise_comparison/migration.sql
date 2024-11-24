/*
  Warnings:

  - You are about to drop the `PairwiseComparison` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PairwiseComparison" DROP CONSTRAINT "PairwiseComparison_book1Id_fkey";

-- DropForeignKey
ALTER TABLE "PairwiseComparison" DROP CONSTRAINT "PairwiseComparison_book2Id_fkey";

-- DropForeignKey
ALTER TABLE "PairwiseComparison" DROP CONSTRAINT "PairwiseComparison_userId_fkey";

-- DropTable
DROP TABLE "PairwiseComparison";
