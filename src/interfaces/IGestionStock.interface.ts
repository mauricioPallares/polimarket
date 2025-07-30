import { Producto } from '../entities/producto.entity';

export interface IGestionStock {
  registrarEntradaProducto(producto: Producto, cantidad: number): void;
  registrarSalidaProducto(producto: Producto, cantidad: number): void;
} 