/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `client_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `client_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `freelancer_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `freelancer_profiles` table. All the data in the column will be lost.
  - You are about to drop the `user_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_userId_fkey";

-- AlterTable
ALTER TABLE "client_profiles" DROP COLUMN "avatarUrl",
DROP COLUMN "bio";

-- AlterTable
ALTER TABLE "freelancer_profiles" DROP COLUMN "avatarUrl",
DROP COLUMN "bio";

-- DropTable
DROP TABLE "user_profiles";

-- DropEnum
DROP TYPE "ProfileType";

-- CreateTable
CREATE TABLE "AccountVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "documentUrl" TEXT,
    "selfieUrl" TEXT,
    "proofOfAddressUrl" TEXT,
    "extractedName" TEXT,
    "extractedBirthdate" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountVerification_userId_key" ON "AccountVerification"("userId");

-- AddForeignKey
ALTER TABLE "AccountVerification" ADD CONSTRAINT "AccountVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
