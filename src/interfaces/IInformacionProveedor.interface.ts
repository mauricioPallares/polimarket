import { Producto } from '../entities/producto.entity';
import { Proveedor } from '../entities/proveedor.entity';

export interface IInformacionProveedor {
  obtenerInformacionProveedor(producto: Producto): Promise<Proveedor>;
} 