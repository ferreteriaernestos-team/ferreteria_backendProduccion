import { Request, Response } from "express"
import * as inventarioService from "../services/inventario.service"
import { ProductosCriticosResponseDTO } from "../dtos/inventario.dto"

export const getProductosCriticos = async (_req: Request, res: Response) => {

  try {

    const productos = await inventarioService.getProductosCriticos()

    const response: ProductosCriticosResponseDTO = {
      productos,
      total: productos.length
    }

    res.json({
      success: true,
      data: response
    })

  } catch (error) {

    console.error("Error inventario críticos:", error)

    res.status(500).json({
      success: false,
      message: "Error obteniendo productos críticos"
    })

  }

}