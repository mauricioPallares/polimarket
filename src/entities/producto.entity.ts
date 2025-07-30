import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Proveedor } from './proveedor.entity';
import { Venta } from './venta.entity';


@Entity()
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column('int')
  stock: number;

  @ManyToOne(() => Proveedor, proveedor => proveedor.productosSuministrados)
  proveedor: Proveedor;

  @ManyToMany(() => Venta, venta => venta.productosVendidos)
  @JoinTable()
  ventas: Venta[];
} 