-- CreateTable
CREATE TABLE "usage_quotas" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "feature" VARCHAR(20) NOT NULL,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "quota_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usage_quotas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usage_quotas_user_id_feature_quota_date_key" ON "usage_quotas"("user_id", "feature", "quota_date");

-- AddForeignKey
ALTER TABLE "usage_quotas" ADD CONSTRAINT "usage_quotas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
