import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Producto } from '../../entities/producto.entity';
import { Proveedor } from '../../entities/proveedor.entity';
import { CreateProductoDto, UpdateProductoDto } from '../../dto/producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productoRepository.create(createProductoDto);
    
    if (createProductoDto.proveedorId) {
      const proveedor = await this.proveedorRepository.findOne({
        where: { id: createProductoDto.proveedorId }
      });
      if (proveedor) {
        producto.proveedor = proveedor;
      }
    }
    
    return this.productoRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find({
      relations: ['proveedor', 'ventas'],
    });
  }

  async findOne(id: string): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['proveedor', 'ventas'],
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  async update(id: string, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    
    if (updateProductoDto.proveedorId) {
      const proveedor = await this.proveedorRepository.findOne({
        where: { id: updateProductoDto.proveedorId }
      });
      if (proveedor) {
        producto.proveedor = proveedor;
      }
    }
    
    Object.assign(producto, updateProductoDto);
    return this.productoRepository.save(producto);
  }

  async remove(id: string): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
  }

  async getProductosConStockBajo(limite: number = 10): Promise<Producto[]> {
    return this.productoRepository.find({
      where: { stock: LessThan(limite) },
      relations: ['proveedor'],
    });
  }

  async getProductosPorProveedor(proveedorId: string): Promise<Producto[]> {
    return this.productoRepository.find({
      where: { proveedor: { id: proveedorId } },
      relations: ['proveedor'],
    });
  }

  async actualizarStock(id: string, cantidad: number, tipo: 'sumar' | 'restar'): Promise<Producto> {
    const producto = await this.findOne(id);
    
    if (tipo === 'sumar') {
      producto.stock += cantidad;
    } else {
      if (producto.stock < cantidad) {
        throw new Error(`Stock insuficiente. Disponible: ${producto.stock}, Solicitado: ${cantidad}`);
      }
      producto.stock -= cantidad;
    }
    
    return this.productoRepository.save(producto);
  }
} 