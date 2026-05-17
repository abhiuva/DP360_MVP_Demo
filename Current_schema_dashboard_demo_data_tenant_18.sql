-- DP360 Dashboard Demo Data Seed
-- Target tenant: 18 / Dealpulse360
--
-- Run after:
-- 1) Current_schema_dashboard changes.sql
--
-- This script is safe to re-run. It refreshes only demo rows identified by:
-- - Demo item/category names
-- - demo token numbers 9001 and 9002
-- - demo invoice ids 900101-900107 for tenant 18

USE salespulse_local;

START TRANSACTION;

SET @tenant_id = 18;

SELECT @admin_username := username
FROM users
WHERE tenant_id = @tenant_id
  AND role = 'admin'
ORDER BY username
LIMIT 1;

-- Fallback: if tenant has no admin user, use any user for this tenant.
SELECT @admin_username := COALESCE(
  @admin_username,
  (
    SELECT username
    FROM users
    WHERE tenant_id = @tenant_id
    ORDER BY username
    LIMIT 1
  )
);

-- Check this result before relying on dashboard preference seed.
SELECT @tenant_id AS tenant_id, @admin_username AS admin_username;

-- Remove previous demo orders/order items for deterministic re-runs.
DELETE oi
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.tenant_id = @tenant_id
  AND o.token_no IN (9001, 9002);

DELETE FROM orders
WHERE tenant_id = @tenant_id
  AND token_no IN (9001, 9002);

DELETE FROM invoices
WHERE tenant_id = @tenant_id
  AND id BETWEEN 900101 AND 900107;

-- Demo category.
INSERT INTO categories (title, tenant_id)
SELECT 'Demo Dashboard Items', @tenant_id
WHERE NOT EXISTS (
  SELECT 1
  FROM categories
  WHERE title = 'Demo Dashboard Items'
    AND tenant_id = @tenant_id
);

SELECT @category_id := id
FROM categories
WHERE title = 'Demo Dashboard Items'
  AND tenant_id = @tenant_id
ORDER BY id
LIMIT 1;

-- Demo inventory items.
INSERT INTO inventory_items
(title, supplier_name, category, quantity, last_ordered_date, tenant_id, image, inventory_changed_time, stock_alert_quantity)
SELECT 'Demo Rice Stock', 'Demo Supplier', @category_id, 4, CURDATE(), @tenant_id, NULL, NOW(), 10
WHERE NOT EXISTS (
  SELECT 1
  FROM inventory_items
  WHERE title = 'Demo Rice Stock'
    AND tenant_id = @tenant_id
);

INSERT INTO inventory_items
(title, supplier_name, category, quantity, last_ordered_date, tenant_id, image, inventory_changed_time, stock_alert_quantity)
SELECT 'Demo Chicken Stock', 'Demo Supplier', @category_id, 25, CURDATE(), @tenant_id, NULL, NOW(), 8
WHERE NOT EXISTS (
  SELECT 1
  FROM inventory_items
  WHERE title = 'Demo Chicken Stock'
    AND tenant_id = @tenant_id
);

INSERT INTO inventory_items
(title, supplier_name, category, quantity, last_ordered_date, tenant_id, image, inventory_changed_time, stock_alert_quantity)
SELECT 'Demo Coke Stock', 'Demo Beverage Supplier', @category_id, 6, CURDATE(), @tenant_id, NULL, NOW(), 12
WHERE NOT EXISTS (
  SELECT 1
  FROM inventory_items
  WHERE title = 'Demo Coke Stock'
    AND tenant_id = @tenant_id
);

SELECT @rice_inventory_id := id
FROM inventory_items
WHERE title = 'Demo Rice Stock'
  AND tenant_id = @tenant_id
ORDER BY id
LIMIT 1;

SELECT @chicken_inventory_id := id
FROM inventory_items
WHERE title = 'Demo Chicken Stock'
  AND tenant_id = @tenant_id
ORDER BY id
LIMIT 1;

SELECT @coke_inventory_id := id
FROM inventory_items
WHERE title = 'Demo Coke Stock'
  AND tenant_id = @tenant_id
ORDER BY id
LIMIT 1;

-- Keep stock values demo-friendly on every re-run.
UPDATE inventory_items
SET quantity = 4,
    stock_alert_quantity = 10,
    inventory_changed_time = NOW()
WHERE id = @rice_inventory_id
  AND tenant_id = @tenant_id;

UPDATE inventory_items
SET quantity = 25,
    stock_alert_quantity = 8,
    inventory_changed_time = NOW()
WHERE id = @chicken_inventory_id
  AND tenant_id = @tenant_id;

UPDATE inventory_items
SET quantity = 6,
    stock_alert_quantity = 12,
    inventory_changed_time = NOW()
WHERE id = @coke_inventory_id
  AND tenant_id = @tenant_id;

-- Inventory valuation support.
INSERT INTO inventory_item_settings
(inventory_item_id, tenant_id, standard_cost, last_purchase_cost, reorder_point, reorder_quantity, par_level)
VALUES
(@rice_inventory_id, @tenant_id, 55.00, 52.00, 10, 50, 80),
(@chicken_inventory_id, @tenant_id, 180.00, 175.00, 8, 25, 40),
(@coke_inventory_id, @tenant_id, 25.00, 22.00, 12, 48, 72)
ON DUPLICATE KEY UPDATE
  standard_cost = VALUES(standard_cost),
  last_purchase_cost = VALUES(last_purchase_cost),
  reorder_point = VALUES(reorder_point),
  reorder_quantity = VALUES(reorder_quantity),
  par_level = VALUES(par_level),
  updated_at = CURRENT_TIMESTAMP;

-- Demo menu items.
INSERT INTO menu_items
(title, price, net_price, tax_id, image, category, tenant_id, inventory_id, discount, tax, status)
SELECT 'Demo Chicken Biryani', 220.00, 220.00, NULL, NULL, @category_id, @tenant_id, @rice_inventory_id, 0.00, 0.00, 'Available'
WHERE NOT EXISTS (
  SELECT 1
  FROM menu_items
  WHERE title = 'Demo Chicken Biryani'
    AND tenant_id = @tenant_id
);

INSERT INTO menu_items
(title, price, net_price, tax_id, image, category, tenant_id, inventory_id, discount, tax, status)
SELECT 'Demo Coke', 60.00, 60.00, NULL, NULL, @category_id, @tenant_id, @coke_inventory_id, 0.00, 0.00, 'Available'
WHERE NOT EXISTS (
  SELECT 1
  FROM menu_items
  WHERE title = 'Demo Coke'
    AND tenant_id = @tenant_id
);

SELECT @biryani_item_id := id
FROM menu_items
WHERE title = 'Demo Chicken Biryani'
  AND tenant_id = @tenant_id
ORDER BY id
LIMIT 1;

SELECT @coke_item_id := id
FROM menu_items
WHERE title = 'Demo Coke'
  AND tenant_id = @tenant_id
ORDER BY id
LIMIT 1;

-- Last 7 days invoice trend data with deterministic invoice IDs.
INSERT INTO invoices
(id, created_at, sub_total, tax_total, total, payment_type_id, tenant_id, charges)
VALUES
(900101, DATE_SUB(NOW(), INTERVAL 6 DAY), 1800.00, 90.00, 1890.00, NULL, @tenant_id, 0.00),
(900102, DATE_SUB(NOW(), INTERVAL 5 DAY), 2450.00, 122.50, 2572.50, NULL, @tenant_id, 0.00),
(900103, DATE_SUB(NOW(), INTERVAL 4 DAY), 3100.00, 155.00, 3255.00, NULL, @tenant_id, 0.00),
(900104, DATE_SUB(NOW(), INTERVAL 3 DAY), 2700.00, 135.00, 2835.00, NULL, @tenant_id, 0.00),
(900105, DATE_SUB(NOW(), INTERVAL 2 DAY), 3900.00, 195.00, 4095.00, NULL, @tenant_id, 0.00),
(900106, DATE_SUB(NOW(), INTERVAL 1 DAY), 4200.00, 210.00, 4410.00, NULL, @tenant_id, 0.00),
(900107, NOW(), 5200.00, 260.00, 5460.00, NULL, @tenant_id, 0.00)
ON DUPLICATE KEY UPDATE
  sub_total = VALUES(sub_total),
  tax_total = VALUES(tax_total),
  total = VALUES(total),
  created_at = VALUES(created_at),
  charges = VALUES(charges);

-- Completed paid order today.
INSERT INTO orders
(date, delivery_type, customer_type, customer_id, table_id, status, token_no, payment_status, invoice_id, tenant_id)
VALUES
(NOW(), 'dine_in', 'WALKIN', NULL, NULL, 'completed', 9001, 'paid', 900107, @tenant_id);

SET @paid_order_id = LAST_INSERT_ID();

INSERT INTO order_items
(order_id, item_id, variant_id, price, quantity, status, date, notes, addons, tenant_id, item_discount, item_name)
VALUES
(@paid_order_id, @biryani_item_id, NULL, 220.00, 8, 'completed', NOW(), NULL, NULL, @tenant_id, 0.00, 'Demo Chicken Biryani'),
(@paid_order_id, @coke_item_id, NULL, 60.00, 6, 'completed', NOW(), NULL, NULL, @tenant_id, 0.00, 'Demo Coke');

-- Open pending order today.
INSERT INTO orders
(date, delivery_type, customer_type, customer_id, table_id, status, token_no, payment_status, invoice_id, tenant_id)
VALUES
(NOW(), 'takeaway', 'WALKIN', NULL, NULL, 'created', 9002, 'pending', NULL, @tenant_id);

SET @open_order_id = LAST_INSERT_ID();

INSERT INTO order_items
(order_id, item_id, variant_id, price, quantity, status, date, notes, addons, tenant_id, item_discount, item_name)
VALUES
(@open_order_id, @biryani_item_id, NULL, 220.00, 3, 'created', NOW(), NULL, NULL, @tenant_id, 0.00, 'Demo Chicken Biryani'),
(@open_order_id, @coke_item_id, NULL, 60.00, 2, 'created', NOW(), NULL, NULL, @tenant_id, 0.00, 'Demo Coke');

-- Save a default admin dashboard preference if a tenant user exists.
INSERT INTO user_dashboard_preferences
(tenant_id, username, selected_widget_keys, layout)
SELECT
  @tenant_id,
  @admin_username,
  JSON_ARRAY(
    'revenue_today',
    'orders_today',
    'open_orders',
    'low_stock',
    'sales_trend_7d',
    'top_items_today',
    'sales_by_payment_status',
    'inventory_value'
  ),
  JSON_OBJECT(
    'revenue_today', JSON_OBJECT('x',0,'y',0,'w',3,'h',2,'minW',2,'minH',2),
    'orders_today', JSON_OBJECT('x',3,'y',0,'w',3,'h',2,'minW',2,'minH',2),
    'open_orders', JSON_OBJECT('x',6,'y',0,'w',3,'h',2,'minW',2,'minH',2),
    'low_stock', JSON_OBJECT('x',9,'y',0,'w',3,'h',2,'minW',2,'minH',2),
    'sales_trend_7d', JSON_OBJECT('x',0,'y',2,'w',6,'h',4,'minW',4,'minH',3),
    'top_items_today', JSON_OBJECT('x',6,'y',2,'w',6,'h',4,'minW',4,'minH',3),
    'sales_by_payment_status', JSON_OBJECT('x',0,'y',6,'w',4,'h',4,'minW',3,'minH',3),
    'inventory_value', JSON_OBJECT('x',4,'y',6,'w',4,'h',2,'minW',3,'minH',2)
  )
WHERE @admin_username IS NOT NULL
ON DUPLICATE KEY UPDATE
  selected_widget_keys = VALUES(selected_widget_keys),
  layout = VALUES(layout),
  updated_at = CURRENT_TIMESTAMP;

COMMIT;

-- Verification.
SELECT @tenant_id AS tenant_id, @admin_username AS admin_username;

SELECT widget_key, title, category
FROM dashboard_widgets
ORDER BY sort_order;

SELECT tenant_id, username, JSON_LENGTH(selected_widget_keys) AS selected_widgets
FROM user_dashboard_preferences
WHERE tenant_id = @tenant_id;

SELECT COUNT(*) AS todays_orders
FROM orders
WHERE tenant_id = @tenant_id
  AND DATE(date) = CURDATE();

SELECT COALESCE(SUM(total), 0) AS todays_revenue
FROM invoices
WHERE tenant_id = @tenant_id
  AND DATE(created_at) = CURDATE();

SELECT title, quantity, stock_alert_quantity
FROM inventory_items
WHERE tenant_id = @tenant_id
  AND quantity <= stock_alert_quantity;
