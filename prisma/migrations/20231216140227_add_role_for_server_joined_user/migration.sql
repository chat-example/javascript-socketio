-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "ServerJoinedUser" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
