import { Producto } from '../entities/producto.entity';

export interface IConsultaProducto {
  obtenerDisponibilidadProducto(producto: Producto): Promise<number>;
} 