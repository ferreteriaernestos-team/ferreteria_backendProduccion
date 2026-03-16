/**
 * DTOs para reportes
 */

export class BoxReportResponseDTO {
  caja!: {
    id: number;
    usuario_id: number;
    fecha_apertura: Date;
    monto_inicial: number;
    fecha_cierre?: Date;
    monto_final?: number;
    estado: string;
  };
  ingresos!: number;
  egresos!: number;
  ventas!: number;
  monto_final_calculado!: number;
}

export class DailyReportResponseDTO {
  totalVentas!: number;
  cantidadVentas!: number;
  productosVendidos!: Record<number, number>;
  fecha?: Date;
}

export class MonthlyReportResponseDTO {
  totalVentas!: number;
  totalIngresos!: number;
  mes?: number;
  año?: number;
}

export class ReportResponseDTO<T> {
  success!: boolean;
  data!: T;
  timestamp?: Date;
}

export class StockAlertResponseDTO {
  producto_id!: number;
  nombre!: string;
  stock_actual!: number;
  stock_minimo!: number;
  dias_restantes!: number;
  nivel_riesgo!: string;
}

export class StockAlertListResponseDTO {
  criticos!: StockAlertResponseDTO[];
  en_riesgo!: StockAlertResponseDTO[];
  total!: number;
}

export class TopProductReportDTO {
  producto!: string;
  ventas!: number;
}
export class TopProductsReportResponseDTO {
  productos!: TopProductReportDTO[];
}

