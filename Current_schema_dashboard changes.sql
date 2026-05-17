-- DP360 Native Dashboard Engine Add-on Schema
-- Source schema reviewed: current_schema.sql
-- Target database in dump: salespulse_local
--
-- Purpose:
-- Fix dashboard preference save failures by adding:
-- 1) dashboard_widgets: configuration-driven widget registry
-- 2) user_dashboard_preferences: tenant/user saved selected widgets + grid layout
--
-- How to run:
-- 1. Open MySQL connected to the correct database.
-- 2. Run: USE salespulse_local;  -- or your actual DB name
-- 3. Paste/run this file.
-- 4. Restart backend.
--
-- This script is additive and safe to re-run.

START TRANSACTION;

CREATE TABLE IF NOT EXISTS `dashboard_widgets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `widget_key` varchar(100) NOT NULL,
  `title` varchar(150) NOT NULL,
  `category` varchar(80) NOT NULL,
  `visualization` enum('number','line_chart','bar_chart','pie_chart','table','hal_ai') NOT NULL,
  `data_key` varchar(100) NOT NULL,
  `required_scope` varchar(80) DEFAULT NULL,
  `default_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `default_layout` json NOT NULL,
  `config` json DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_dashboard_widgets_key` (`widget_key`),
  KEY `idx_dashboard_widgets_category` (`category`),
  KEY `idx_dashboard_widgets_scope` (`required_scope`),
  KEY `idx_dashboard_widgets_active` (`is_active`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_dashboard_preferences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tenant_id` int NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `selected_widget_keys` json NOT NULL,
  `layout` json NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_dashboard_preferences_user` (`tenant_id`,`username`),
  KEY `idx_user_dashboard_preferences_tenant` (`tenant_id`),
  KEY `idx_user_dashboard_preferences_username` (`username`),
  CONSTRAINT `fk_user_dashboard_preferences_tenant`
    FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_dashboard_preferences_user`
    FOREIGN KEY (`username`) REFERENCES `users` (`username`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `dashboard_widgets`
(
  `widget_key`,
  `title`,
  `category`,
  `visualization`,
  `data_key`,
  `required_scope`,
  `default_enabled`,
  `default_layout`,
  `config`,
  `sort_order`,
  `is_active`
)
VALUES
(
  'revenue_today',
  'Today''s Revenue',
  'Sales',
  'number',
  'revenue_today',
  'REPORTS',
  1,
  JSON_OBJECT('x',0,'y',0,'w',3,'h',2,'minW',2,'minH',2),
  JSON_OBJECT('format','currency'),
  10,
  1
),
(
  'orders_today',
  'Today''s Orders',
  'Sales',
  'number',
  'orders_today',
  'DASHBOARD',
  1,
  JSON_OBJECT('x',3,'y',0,'w',3,'h',2,'minW',2,'minH',2),
  JSON_OBJECT('format','number'),
  20,
  1
),
(
  'open_orders',
  'Open Orders',
  'Operations',
  'number',
  'open_orders',
  'ORDERS',
  1,
  JSON_OBJECT('x',6,'y',0,'w',3,'h',2,'minW',2,'minH',2),
  JSON_OBJECT('format','number'),
  30,
  1
),
(
  'low_stock',
  'Low Stock Items',
  'Inventory',
  'number',
  'low_stock',
  'INVENTORY',
  1,
  JSON_OBJECT('x',9,'y',0,'w',3,'h',2,'minW',2,'minH',2),
  JSON_OBJECT('format','number'),
  40,
  1
),
(
  'sales_trend_7d',
  'Sales Trend',
  'Sales',
  'line_chart',
  'sales_trend_7d',
  'REPORTS',
  1,
  JSON_OBJECT('x',0,'y',2,'w',6,'h',4,'minW',4,'minH',3),
  JSON_OBJECT('subtitle','Last 7 days'),
  50,
  1
),
(
  'top_items_today',
  'Top Items Today',
  'Sales',
  'bar_chart',
  'top_items_today',
  'REPORTS',
  1,
  JSON_OBJECT('x',6,'y',2,'w',6,'h',4,'minW',4,'minH',3),
  JSON_OBJECT('subtitle','By quantity sold'),
  60,
  1
),
(
  'sales_by_payment_status',
  'Payment Status Mix',
  'Finance',
  'pie_chart',
  'sales_by_payment_status',
  'REPORTS',
  1,
  JSON_OBJECT('x',0,'y',6,'w',4,'h',4,'minW',3,'minH',3),
  JSON_OBJECT(),
  70,
  1
),
(
  'inventory_value',
  'Estimated Inventory Value',
  'Inventory',
  'number',
  'inventory_value',
  'INVENTORY',
  1,
  JSON_OBJECT('x',4,'y',6,'w',4,'h',2,'minW',3,'minH',2),
  JSON_OBJECT('format','currency'),
  80,
  1
),
(
  'hal_ai_insights',
  'HAL AI Insights',
  'AI',
  'hal_ai',
  'hal_ai_insights',
  'DASHBOARD',
  0,
  JSON_OBJECT('x',8,'y',6,'w',4,'h',3,'minW',3,'minH',2),
  JSON_OBJECT('provider','future_hal'),
  90,
  1
)
ON DUPLICATE KEY UPDATE
  `title` = VALUES(`title`),
  `category` = VALUES(`category`),
  `visualization` = VALUES(`visualization`),
  `data_key` = VALUES(`data_key`),
  `required_scope` = VALUES(`required_scope`),
  `default_enabled` = VALUES(`default_enabled`),
  `default_layout` = VALUES(`default_layout`),
  `config` = VALUES(`config`),
  `sort_order` = VALUES(`sort_order`),
  `is_active` = VALUES(`is_active`),
  `updated_at` = CURRENT_TIMESTAMP;

COMMIT;

-- Verification query 1: these two rows should appear.
SELECT table_name
FROM information_schema.tables
WHERE table_schema = DATABASE()
  AND table_name IN ('dashboard_widgets', 'user_dashboard_preferences')
ORDER BY table_name;

-- Verification query 2: should return 9 dashboard widgets.
SELECT
  `widget_key`,
  `title`,
  `category`,
  `visualization`,
  `required_scope`,
  `default_enabled`,
  `is_active`
FROM `dashboard_widgets`
ORDER BY `sort_order`;

-- Verification query 3: use this after saving dashboard preferences from UI.
-- Replace tenant_id if needed.
SELECT
  `tenant_id`,
  `username`,
  JSON_LENGTH(`selected_widget_keys`) AS selected_widget_count,
  `updated_at`
FROM `user_dashboard_preferences`
ORDER BY `updated_at` DESC, `created_at` DESC;
