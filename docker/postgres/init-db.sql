-- Initial database setup for clinic-inventory.
-- Customize this script with seed data or schema migrations that must run
-- when the PostgreSQL container is created.

CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO inventory_items (sku, name, quantity)
VALUES ('SEED-ITEM-001', 'Seed inventory item', 10)
ON CONFLICT (sku) DO NOTHING;
