/*
  Warnings:

  - Added the required column `link` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'REVISION';
ALTER TYPE "Status" ADD VALUE 'DRAFT';
ALTER TYPE "Status" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "facilitator" TEXT,
ADD COLUMN     "link" TEXT NOT NULL;
