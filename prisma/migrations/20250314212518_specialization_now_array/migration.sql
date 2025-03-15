/*
  Warnings:

  - The `specialization` column on the `SponsorsData` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SponsorsData" DROP COLUMN "specialization",
ADD COLUMN     "specialization" TEXT[];
