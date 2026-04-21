-- ============================================================
-- Migration: Add calculator_settings table
-- Run once against your MySQL database.
-- ============================================================

CREATE TABLE IF NOT EXISTS calculator_settings (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    setting_key   VARCHAR(100) NOT NULL UNIQUE,
    setting_value LONGTEXT     NOT NULL,
    updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed with NEPRA 2024 defaults so the table is never empty.
INSERT INTO calculator_settings (setting_key, setting_value) VALUES
    ('tariff_slabs',        '[{"limit":100,"rate":3.95},{"limit":200,"rate":7.74},{"limit":300,"rate":10.06},{"limit":400,"rate":12.15},{"limit":500,"rate":14.51},{"limit":600,"rate":17.55},{"limit":700,"rate":20.0},{"limit":999999,"rate":22.65}]'),
    ('export_rate',         '19.32'),
    ('ongrid_cost_per_kw',  '90000'),
    ('hybrid_cost_per_kw',  '140000'),
    ('peak_sun_hours',      '5.5'),
    ('system_efficiency',   '0.8'),
    ('panel_degradation',   '0.005'),
    ('tariff_increase_rate','0.08'),
    ('days_per_month',      '30'),
    ('sqft_per_kw',         '80'),
    ('ongrid_tariff_rate',  '22.65'),
    ('hybrid_tariff_rate',  '20.0')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
