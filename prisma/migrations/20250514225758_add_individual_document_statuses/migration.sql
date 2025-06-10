-- AlterTable
ALTER TABLE "AccountVerification" ADD COLUMN     "documentRejectionReason" TEXT,
ADD COLUMN     "documentStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "proofOfAddressRejectionReason" TEXT,
ADD COLUMN     "proofOfAddressStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "selfieRejectionReason" TEXT,
ADD COLUMN     "selfieStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING';
