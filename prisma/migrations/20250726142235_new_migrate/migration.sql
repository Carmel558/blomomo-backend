/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber,userId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_phoneNumber_userId_key" ON "Client"("phoneNumber", "userId");
