/*
  Warnings:

  - Added the required column `status` to the `SponsorsData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `SponsorsOffert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `SponsorsPost` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "SponsorsData" ADD COLUMN     "status" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "SponsorsOffert" ADD COLUMN     "status" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "SponsorsPost" ADD COLUMN     "status" "Status" NOT NULL;
