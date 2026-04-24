/*
  Warnings:

  - You are about to drop the column `promotional` on the `notification_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyDigest` on the `notification_preferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notification_preferences" DROP COLUMN "promotional",
DROP COLUMN "weeklyDigest";

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "rule" TEXT;
