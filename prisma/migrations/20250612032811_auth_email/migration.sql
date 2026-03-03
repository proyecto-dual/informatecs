/*
  Warnings:

  - You are about to drop the column `smsCode` on the `authStudents` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `authStudents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "authStudents" DROP COLUMN "smsCode",
DROP COLUMN "telefono",
ADD COLUMN     "correo" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "emailCode" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
