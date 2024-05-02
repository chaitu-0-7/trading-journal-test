-- CreateTable
CREATE TABLE "Instruments" (
    "id" SERIAL NOT NULL,
    "instruments" TEXT[],

    CONSTRAINT "Instruments_pkey" PRIMARY KEY ("id")
);
