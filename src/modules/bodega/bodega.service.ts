import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Producto } from '../../entities/producto.entity';
import { Proveedor } from '../../entities/proveedor.entity';
import { IGestionStock } from '../../interfaces/IGestionStock.interface';
import { IConsultaProducto } from '../../interfaces/IConsultaProducto.interface';
import { IInformacionProveedor } from '../../interfaces/IInformacionProveedor.interface';

@Injectable()
export class BodegaService implements IGestionStock, IConsultaProducto, IInformacionProveedor {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
  ) {}

  async registrarEntradaProducto(producto: Producto, cantidad: number): Promise<void> {
    producto.stock += cantidad;
    await this.productoRepository.save(producto);
  }

  async registrarSalidaProducto(producto: Producto, cantidad: number): Promise<void> {
    if (producto.stock < cantidad) {
      throw new Error(`Stock insuficiente. Disponible: ${producto.stock}, Solicitado: ${cantidad}`);
    }
    producto.stock -= cantidad;
    await this.productoRepository.save(producto);
  }

  async obtenerDisponibilidadProducto(producto: Producto): Promise<number> {
    return producto.stock;
  }

  async obtenerInformacionProveedor(producto: Producto): Promise<Proveedor> {
    const productoConProveedor = await this.productoRepository.findOne({
      where: { id: producto.id },
      relations: ['proveedor'],
    });

    if (!productoConProveedor || !productoConProveedor.proveedor) {
      throw new NotFoundException('Proveedor no encontrado para este producto');
    }

    return productoConProveedor.proveedor;
  }

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find({
      relations: ['proveedor'],
    });
  }

  async findOne(id: string): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['proveedor'],
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  async updateStock(id: string, cantidad: number, tipo: 'entrada' | 'salida'): Promise<Producto> {
    const producto = await this.findOne(id);
    
    if (tipo === 'entrada') {
      await this.registrarEntradaProducto(producto, cantidad);
    } else {
      await this.registrarSalidaProducto(producto, cantidad);
    }

    return this.findOne(id);
  }

  async getStockBajo(limite: number = 10): Promise<Producto[]> {
    return this.productoRepository.find({
      where: { stock: LessThan(limite) },
      relations: ['proveedor'],
    });
  }
} 