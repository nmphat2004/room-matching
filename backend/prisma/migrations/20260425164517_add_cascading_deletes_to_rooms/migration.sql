-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_roomId_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_roomId_fkey";

-- DropForeignKey
ALTER TABLE "saved_rooms" DROP CONSTRAINT "saved_rooms_roomId_fkey";

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_rooms" ADD CONSTRAINT "saved_rooms_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
