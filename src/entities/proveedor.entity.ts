import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from './producto.entity';

@Entity()
export class Proveedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  contacto: string;

  @OneToMany(() => Producto, producto => producto.proveedor)
  productosSuministrados: Producto[];
} 