/*
  Warnings:

  - A unique constraint covering the columns `[name,channelGroupId]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,serverId]` on the table `ChannelGroup` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,password]` on the table `Server` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,serverId]` on the table `ServerJoinedUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_channelGroupId_key" ON "Channel"("name", "channelGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelGroup_name_serverId_key" ON "ChannelGroup"("name", "serverId");

-- CreateIndex
CREATE UNIQUE INDEX "Server_name_password_key" ON "Server"("name", "password");

-- CreateIndex
CREATE UNIQUE INDEX "ServerJoinedUser_userId_serverId_key" ON "ServerJoinedUser"("userId", "serverId");
