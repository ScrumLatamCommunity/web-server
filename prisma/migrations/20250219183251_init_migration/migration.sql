-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'SPONSOR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "membership" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "onboarding" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorsData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "companyName" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "web" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "socials" TEXT[],
    "logo" TEXT NOT NULL,
    "bannerWeb" TEXT NOT NULL,
    "bannerMobile" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorsData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorsPost" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3),
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "imageWeb" TEXT NOT NULL,
    "imageMobile" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorsPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsorsOffert" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "title" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "intendedFor" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorsOffert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SponsorsData_userId_key" ON "SponsorsData"("userId");

-- AddForeignKey
ALTER TABLE "SponsorsData" ADD CONSTRAINT "SponsorsData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorsPost" ADD CONSTRAINT "SponsorsPost_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "SponsorsData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorsOffert" ADD CONSTRAINT "SponsorsOffert_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "SponsorsData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
