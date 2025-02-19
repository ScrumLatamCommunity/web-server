/*
  Warnings:

  - You are about to drop the column `category` on the `SponsorsOffert` table. All the data in the column will be lost.
  - Added the required column `discount` to the `SponsorsOffert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intendedFor` to the `SponsorsOffert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `palce` to the `SponsorsOffert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `SponsorsOffert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SponsorsOffert" DROP COLUMN "category",
ADD COLUMN     "discount" TEXT NOT NULL,
ADD COLUMN     "intendedFor" TEXT NOT NULL,
ADD COLUMN     "palce" TEXT NOT NULL,
ADD COLUMN     "time" TEXT NOT NULL;
