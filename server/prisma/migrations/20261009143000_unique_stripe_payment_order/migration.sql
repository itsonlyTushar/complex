DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "Order"
        WHERE "paymentIntentId" IS NOT NULL
        GROUP BY "paymentIntentId"
        HAVING COUNT(*) > 1
    ) THEN
        RAISE EXCEPTION 'Duplicate Stripe payment intents exist in Order; reconcile them before applying this migration.';
    END IF;
END $$;

CREATE UNIQUE INDEX "Order_paymentIntentId_key" ON "Order"("paymentIntentId");
