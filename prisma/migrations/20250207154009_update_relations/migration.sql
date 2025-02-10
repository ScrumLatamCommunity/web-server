-- CreateTable
CREATE TABLE "SponsorsData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "web" TEXT NOT NULL,
    "phone" BIGINT NOT NULL,
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
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsorsOffert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SponsorsData_userId_key" ON "SponsorsData"("userId");

-- AddForeignKey
ALTER TABLE "SponsorsData" ADD CONSTRAINT "SponsorsData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorsPost" ADD CONSTRAINT "SponsorsPost_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "SponsorsData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SponsorsOffert" ADD CONSTRAINT "SponsorsOffert_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "SponsorsData"("id") ON DELETE CASCADE ON UPDATE CASCADE;
