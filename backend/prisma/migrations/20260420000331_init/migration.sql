-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "code_kimiker" TEXT NOT NULL,
    "name_cc" TEXT NOT NULL,
    "name_kimiker" TEXT,
    "category" TEXT,
    "formats" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formats" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grams" INTEGER NOT NULL,
    "kg_fraction" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "formats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prices" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "format_id" TEXT NOT NULL,
    "usd_per_kg" DECIMAL(65,30) NOT NULL,
    "ars_base_price" DECIMAL(65,30) NOT NULL,
    "ars_price_with_discount" DECIMAL(65,30),
    "margin_percentage" DECIMAL(65,30),
    "cost_plus_iva_envio" DECIMAL(65,30),
    "is_custom_price" BOOLEAN NOT NULL DEFAULT false,
    "date_frozen" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT,
    "is_mayorista" BOOLEAN NOT NULL DEFAULT false,
    "priority_rank" INTEGER NOT NULL DEFAULT 0,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitor_prices" (
    "id" TEXT NOT NULL,
    "competitor_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "format_id" TEXT NOT NULL,
    "competitor_code" TEXT,
    "price_ars" DECIMAL(65,30) NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competitor_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volume_discounts" (
    "id" TEXT NOT NULL,
    "format_id" TEXT NOT NULL,
    "min_quantity" INTEGER NOT NULL,
    "discount_percentage" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "volume_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "margin_history" (
    "id" TEXT NOT NULL,
    "price_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "format_id" TEXT NOT NULL,
    "margin_percentage" DECIMAL(65,30) NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "period_date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "margin_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_kimiker_key" ON "products"("code_kimiker");

-- CreateIndex
CREATE INDEX "products_code_kimiker_idx" ON "products"("code_kimiker");

-- CreateIndex
CREATE UNIQUE INDEX "formats_name_key" ON "formats"("name");

-- CreateIndex
CREATE INDEX "prices_product_id_idx" ON "prices"("product_id");

-- CreateIndex
CREATE INDEX "prices_format_id_idx" ON "prices"("format_id");

-- CreateIndex
CREATE UNIQUE INDEX "prices_product_id_format_id_key" ON "prices"("product_id", "format_id");

-- CreateIndex
CREATE UNIQUE INDEX "competitors_name_key" ON "competitors"("name");

-- CreateIndex
CREATE INDEX "competitor_prices_competitor_id_idx" ON "competitor_prices"("competitor_id");

-- CreateIndex
CREATE INDEX "competitor_prices_product_id_idx" ON "competitor_prices"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_prices_competitor_id_product_id_format_id_key" ON "competitor_prices"("competitor_id", "product_id", "format_id");

-- CreateIndex
CREATE INDEX "margin_history_period_date_idx" ON "margin_history"("period_date");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "system_config"("key");

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_format_id_fkey" FOREIGN KEY ("format_id") REFERENCES "formats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_prices" ADD CONSTRAINT "competitor_prices_competitor_id_fkey" FOREIGN KEY ("competitor_id") REFERENCES "competitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_prices" ADD CONSTRAINT "competitor_prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_prices" ADD CONSTRAINT "competitor_prices_format_id_fkey" FOREIGN KEY ("format_id") REFERENCES "formats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volume_discounts" ADD CONSTRAINT "volume_discounts_format_id_fkey" FOREIGN KEY ("format_id") REFERENCES "formats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "margin_history" ADD CONSTRAINT "margin_history_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "prices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "margin_history" ADD CONSTRAINT "margin_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "margin_history" ADD CONSTRAINT "margin_history_format_id_fkey" FOREIGN KEY ("format_id") REFERENCES "formats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
