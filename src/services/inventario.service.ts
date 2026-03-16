import { prisma } from "../config/prisma"
import { ProductoInventarioDTO } from "../dtos/inventario.dto"

export const getProductosCriticos = async (): Promise<ProductoInventarioDTO[]> => {

  const productos = await prisma.productos.findMany({
    where: {
      activo: true
    },
    include: {
      proveedores: {
        select: {
          nombre: true
        }
      }
    }
  })

  const criticos = productos.filter(
    (p) => p.stock <= p.stock_minimo
  )

  return criticos.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    stock: p.stock,
    stock_minimo: p.stock_minimo,
    proveedor: p.proveedores?.nombre || null
  }))
}   