-- CreateTable
CREATE TABLE "ModuleAuditLog" (
    "id" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModuleAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ModuleAuditLog_moduleName_idx" ON "ModuleAuditLog"("moduleName");

-- CreateIndex
CREATE INDEX "ModuleAuditLog_userId_idx" ON "ModuleAuditLog"("userId");

-- CreateIndex
CREATE INDEX "ModuleAuditLog_timestamp_idx" ON "ModuleAuditLog"("timestamp");

-- AddForeignKey
ALTER TABLE "ModuleAuditLog" ADD CONSTRAINT "ModuleAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
