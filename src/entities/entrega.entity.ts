import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Pedido } from './pedido.entity';

@Entity()
export class Entrega {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pedido, pedido => pedido.entregas)
  pedido: Pedido;

  @Column('datetime')
  fechaEntrega: Date;

  @Column()
  estado: string; // 'pendiente', 'en_camino', 'entregado', 'cancelado'
} 