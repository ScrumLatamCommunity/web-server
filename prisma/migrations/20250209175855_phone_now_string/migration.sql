/*
  Warnings:

  - You are about to drop the column `name` on the `SponsorsData` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `SponsorsData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SponsorsData" DROP COLUMN "name",
ADD COLUMN     "companyName" TEXT NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE TEXT;
