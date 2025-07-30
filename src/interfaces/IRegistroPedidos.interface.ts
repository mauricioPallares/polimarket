import { Pedido } from '../entities/pedido.entity';

export interface IRegistroPedidos {
  registrarEntrega(pedido: Pedido): Promise<boolean>;
} 