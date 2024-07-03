/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `cedents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cedents_email_key" ON "cedents"("email");
