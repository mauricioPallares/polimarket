import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Venta } from './venta.entity';

@Entity()
export class Vendedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column('boolean', { default: false })
  estadoAutorizacion: boolean;

  @OneToMany(() => Venta, venta => venta.vendedor)
  ventas: Venta[];


} 