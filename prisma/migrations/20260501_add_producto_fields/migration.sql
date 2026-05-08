ALTER TABLE `productos`
  ADD COLUMN `precio_anterior` DECIMAL(10,2) NULL AFTER `precio_venta`,
  ADD COLUMN `marca` VARCHAR(100) NULL AFTER `stock_minimo`,
  ADD COLUMN `imagen` VARCHAR(500) NULL AFTER `marca`,
  ADD COLUMN `badge` VARCHAR(50) NULL AFTER `imagen`;
