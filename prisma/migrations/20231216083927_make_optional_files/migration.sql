-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ChannelGroup" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Server" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "icon" DROP NOT NULL,
ALTER COLUMN "banner" DROP NOT NULL;
