import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Venta } from './venta.entity';
import { Entrega } from './entrega.entity';

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Venta, venta => venta.pedidos)
  venta: Venta;

  @Column()
  estadoEntrega: string; // 'pendiente', 'en_proceso', 'entregado', 'cancelado'

  @OneToMany(() => Entrega, entrega => entrega.pedido)
  entregas: Entrega[];
} 