import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Vendedor } from './vendedor.entity';
import { Cliente } from './cliente.entity';
import { Producto } from './producto.entity';
import { Pedido } from './pedido.entity';

@Entity()
export class Venta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vendedor, vendedor => vendedor.ventas)
  vendedor: Vendedor;

  @ManyToOne(() => Cliente, cliente => cliente.ventas)
  cliente: Cliente;

  @ManyToMany(() => Producto, producto => producto.ventas)
  @JoinTable()
  productosVendidos: Producto[];

  @Column('datetime')
  fecha: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => Pedido, pedido => pedido.venta)
  pedidos: Pedido[];
} 