-- ==========================================
-- CRM PRO DEFAULT SEED DATA
-- ==========================================

-- ==========================================
-- SYSTEM CUSTOMER FIELDS
-- ==========================================

INSERT INTO company_customer_fields (
    field_key,
    field_label,
    field_type,
    is_required,
    is_visible,
    display_order,
    is_system,
    field_group,
    show_in,
    sort_order,
    storage_key
)
VALUES
(
    'customer_code',
    'Customer Code',
    'text',
    TRUE,
    TRUE,
    2,
    TRUE,
    'customer',
    '{"list": true, "dialog": true, "import": true, "search": true, "profile": true}',
    0,
    'customer_code'
),
(
    'customer_name',
    'Customer Name',
    'text',
    TRUE,
    TRUE,
    1,
    TRUE,
    'customer',
    '{"list": true, "dialog": true, "import": true, "search": true, "profile": true}',
    0,
    'name'
)
ON CONFLICT (field_key) DO NOTHING;


-- ==========================================
-- NOTIFICATION TYPES
-- ==========================================

INSERT INTO notification_types (
    key,
    name,
    description,
    category,
    default_enabled
)
VALUES
(
    'low_stock',
    'Low Stock',
    'Alert when product stock reaches the configured threshold.',
    'inventory',
    TRUE
),
(
    'amc_due',
    'AMC Due',
    'Alert before a customer AMC expires.',
    'service',
    TRUE
),
(
    'amc_expired',
    'AMC Expired',
    'Alert when customer AMC has expired.',
    'service',
    TRUE
),
(
    'payment_pending',
    'Payment Pending',
    'Alert for pending customer payments.',
    'payment',
    TRUE
),
(
    'payment_overdue',
    'Payment Overdue',
    'Alert when payment becomes overdue.',
    'payment',
    TRUE
),
(
    'service_due',
    'Service Due',
    'Alert when customer service is due.',
    'service',
    TRUE
)
ON CONFLICT (key) DO NOTHING;


-- ==========================================
-- NOTIFICATION SETTINGS
-- ==========================================

INSERT INTO notification_settings (
    notification_type_id,
    enabled,
    threshold,
    days_before,
    priority
)
SELECT
    id,
    CASE key
        WHEN 'low_stock' THEN TRUE
        WHEN 'amc_due' THEN TRUE
        WHEN 'amc_expired' THEN TRUE
        WHEN 'payment_pending' THEN TRUE
        WHEN 'payment_overdue' THEN TRUE
        WHEN 'service_due' THEN TRUE
    END,
    CASE
        WHEN key = 'low_stock' THEN 10
        ELSE NULL
    END,
    CASE
        WHEN key = 'amc_due' THEN 30
        WHEN key = 'service_due' THEN 7
        ELSE NULL
    END,
    CASE
        WHEN key IN ('amc_expired', 'payment_overdue')
            THEN 'high'
        ELSE 'normal'
    END
FROM notification_types
WHERE key IN (
    'low_stock',
    'amc_due',
    'amc_expired',
    'payment_pending',
    'payment_overdue',
    'service_due'
)
ON CONFLICT (notification_type_id)
DO UPDATE SET
    enabled = EXCLUDED.enabled,
    threshold = EXCLUDED.threshold,
    days_before = EXCLUDED.days_before,
    priority = EXCLUDED.priority,
    updated_at = CURRENT_TIMESTAMP;


-- ==========================================
-- DASHBOARD WIDGET SETTINGS
-- ==========================================

INSERT INTO dashboard_widget_settings (
    widget_id,
    enabled
)
VALUES
('customers', TRUE),
('products', TRUE),
('orders', TRUE),
('revenue', TRUE),
('recentOrders', TRUE),
('lowStockProducts', TRUE),
('topSellingProducts', TRUE)
ON CONFLICT (widget_id)
DO UPDATE SET
    enabled = EXCLUDED.enabled,
    updated_at = CURRENT_TIMESTAMP;