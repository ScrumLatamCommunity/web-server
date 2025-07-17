/*
  Warnings:

  - You are about to drop the column `description` on the `SponsorsData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SponsorsData" DROP COLUMN "description";

-- CreateTable
CREATE TABLE "SponsorDescription" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "SponsorDescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SponsorCertificates" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SponsorCertificates_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SponsorCertificates_B_index" ON "_SponsorCertificates"("B");

-- AddForeignKey
ALTER TABLE "SponsorDescription" ADD CONSTRAINT "SponsorDescription_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "SponsorsData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SponsorCertificates" ADD CONSTRAINT "_SponsorCertificates_A_fkey" FOREIGN KEY ("A") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SponsorCertificates" ADD CONSTRAINT "_SponsorCertificates_B_fkey" FOREIGN KEY ("B") REFERENCES "SponsorsData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
