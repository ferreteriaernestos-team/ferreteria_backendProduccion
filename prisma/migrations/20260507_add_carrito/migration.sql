-- CreateTable
CREATE TABLE `carritos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_id` VARCHAR(64) NOT NULL,
    `cliente_id` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `carritos_session_id_key`(`session_id`),
    INDEX `carritos_cliente_id_idx`(`cliente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carrito_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `carrito_id` INTEGER NOT NULL,
    `producto_id` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precio_unitario` DECIMAL(10, 2) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `carrito_items_carrito_id_idx`(`carrito_id`),
    INDEX `carrito_items_producto_id_idx`(`producto_id`),
    UNIQUE INDEX `carrito_items_carrito_id_producto_id_key`(`carrito_id`, `producto_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `carritos` ADD CONSTRAINT `carritos_cliente_id_fkey`
    FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `carrito_items` ADD CONSTRAINT `carrito_items_carrito_id_fkey`
    FOREIGN KEY (`carrito_id`) REFERENCES `carritos`(`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `carrito_items` ADD CONSTRAINT `carrito_items_producto_id_fkey`
    FOREIGN KEY (`producto_id`) REFERENCES `productos`(`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION;
