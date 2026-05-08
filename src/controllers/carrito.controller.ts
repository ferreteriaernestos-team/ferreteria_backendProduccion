import { Request, Response } from "express";
import * as carritoService from "../services/carrito.service";

export const getCarrito = async (req: Request, res: Response) => {
  try {
    const session_id = req.query.session_id as string;
    if (!session_id) {
      return res.status(400).json({ success: false, message: "session_id requerido" });
    }

    const carrito = await carritoService.getCarrito(session_id);
    res.json({ success: true, data: carrito });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addItem = async (req: Request, res: Response) => {
  try {
    const { session_id, producto_id, cantidad, cliente_id } = req.body;

    if (!session_id || !producto_id || !cantidad) {
      return res.status(400).json({ success: false, message: "session_id, producto_id y cantidad son requeridos" });
    }

    const carrito = await carritoService.addOrUpdateItem(
      session_id,
      Number(producto_id),
      Number(cantidad),
      cliente_id ? Number(cliente_id) : undefined
    );

    res.json({ success: true, data: carrito });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const producto_id = Number(req.params.producto_id);
    const { session_id, cantidad } = req.body;

    if (!session_id || !cantidad) {
      return res.status(400).json({ success: false, message: "session_id y cantidad son requeridos" });
    }

    const carrito = await carritoService.addOrUpdateItem(session_id, producto_id, Number(cantidad));
    res.json({ success: true, data: carrito });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const removeItem = async (req: Request, res: Response) => {
  try {
    const producto_id = Number(req.params.producto_id);
    const session_id = req.query.session_id as string;

    if (!session_id) {
      return res.status(400).json({ success: false, message: "session_id requerido" });
    }

    const carrito = await carritoService.removeItem(session_id, producto_id);
    res.json({ success: true, data: carrito });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const clearCarrito = async (req: Request, res: Response) => {
  try {
    const session_id = req.query.session_id as string;

    if (!session_id) {
      return res.status(400).json({ success: false, message: "session_id requerido" });
    }

    const carrito = await carritoService.clearCarrito(session_id);
    res.json({ success: true, data: carrito });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkout = async (req: Request, res: Response) => {
  try {
    const { session_id, direccion_entrega, observaciones, cliente_id, nombre, telefono, email } = req.body;

    if (!session_id || !direccion_entrega) {
      return res.status(400).json({ success: false, message: "session_id y direccion_entrega son requeridos" });
    }

    if (!cliente_id && (!nombre || !telefono)) {
      return res.status(400).json({
        success: false,
        message: "Se requiere cliente_id o nombre+telefono para hacer checkout",
      });
    }

    const pedido = await carritoService.checkout(session_id, {
      direccion_entrega,
      observaciones,
      cliente_id: cliente_id ? Number(cliente_id) : undefined,
      nombre,
      telefono,
      email,
    });

    res.status(201).json({ success: true, message: "Pedido creado exitosamente", data: pedido });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
