-- CreateTable
CREATE TABLE "ai_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "status" VARCHAR(20) NOT NULL,
    "endpoint" VARCHAR(100) NOT NULL,
    "prediction" VARCHAR(50),
    "confidence" DOUBLE PRECISION,
    "error_message" TEXT,
    "latency_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ai_logs" ADD CONSTRAINT "ai_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
