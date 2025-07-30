import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from '../../entities/proveedor.entity';
import { Producto } from '../../entities/producto.entity';
import { IInformacionProveedor } from '../../interfaces/IInformacionProveedor.interface';

@Injectable()
export class ProveedoresService implements IInformacionProveedor {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async registrarProveedor(proveedor: Proveedor): Promise<boolean> {
    try {
      await this.proveedorRepository.save(proveedor);
      return true;
    } catch (error) {
      console.error('Error al registrar proveedor:', error);
      return false;
    }
  }

  async obtenerProductosProveedor(proveedor: Proveedor): Promise<Producto[]> {
    return this.productoRepository.find({
      where: { proveedor: { id: proveedor.id } },
      relations: ['proveedor'],
    });
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

  async findAll(): Promise<Proveedor[]> {
    return this.proveedorRepository.find({
      relations: ['productosSuministrados'],
    });
  }

  async findOne(id: string): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { id },
      relations: ['productosSuministrados'],
    });

    if (!proveedor) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return proveedor;
  }

  async create(createProveedorDto: any): Promise<Proveedor> {
    const proveedor = this.proveedorRepository.create(createProveedorDto);
    const savedProveedor = await this.proveedorRepository.save(proveedor);
    return Array.isArray(savedProveedor) ? savedProveedor[0] : savedProveedor;
  }

  async update(id: string, updateProveedorDto: any): Promise<Proveedor> {
    const proveedor = await this.findOne(id);
    Object.assign(proveedor, updateProveedorDto);
    return await this.proveedorRepository.save(proveedor);
  }

  async remove(id: string): Promise<void> {
    const proveedor = await this.findOne(id);
    await this.proveedorRepository.remove(proveedor);
  }

  async getProductosByProveedorId(proveedorId: string): Promise<Producto[]> {
    const proveedor = await this.findOne(proveedorId);
    return this.obtenerProductosProveedor(proveedor);
  }
} 