-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'SPONSOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
