import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendedor } from '../../entities/vendedor.entity';
import { AutorizarVendedorDto } from '../../dto/vendedor.dto';

@Injectable()
export class RecursoHumanoService {
  constructor(
    @InjectRepository(Vendedor)
    private vendedorRepository: Repository<Vendedor>,
  ) {}

  async autorizarVendedor(vendedor: Vendedor): Promise<boolean> {
    try {
      // Lógica de autorización del vendedor
      vendedor.estadoAutorizacion = true;
      await this.vendedorRepository.save(vendedor);
      return true;
    } catch (error) {
      console.error('Error al autorizar vendedor:', error);
      return false;
    }
  }

  async findAll(): Promise<Vendedor[]> {
    return this.vendedorRepository.find();
  }

  async findOne(id: string): Promise<Vendedor> {
    const vendedor = await this.vendedorRepository.findOne({
      where: { id }
    });

    if (!vendedor) {
      throw new NotFoundException('Vendedor no encontrado');
    }

    return vendedor;
  }

  async create(createVendedorDto: any): Promise<Vendedor> {
    const vendedor = this.vendedorRepository.create(createVendedorDto);
    const vendedorGuardado = await this.vendedorRepository.save(vendedor);
    if (!vendedorGuardado) {
      throw new Error('No se pudo crear el vendedor');
    }
    return vendedorGuardado[0];
  }

  async update(id: string, updateVendedorDto: any): Promise<Vendedor> {
    const vendedor = await this.findOne(id);
    Object.assign(vendedor, updateVendedorDto);
    return await this.vendedorRepository.save(vendedor);
  }

  async autorizarVendedorById(id: string, autorizarDto: AutorizarVendedorDto): Promise<Vendedor> {
    const vendedor = await this.findOne(id);
    vendedor.estadoAutorizacion = autorizarDto.estadoAutorizacion;
    return this.vendedorRepository.save(vendedor);
  }

  async remove(id: string): Promise<void> {
    const vendedor = await this.findOne(id);
    await this.vendedorRepository.remove(vendedor);
  }

  async getVendedoresAutorizados(): Promise<Vendedor[]> {
    return this.vendedorRepository.find({
      where: { estadoAutorizacion: true }
    });
  }

  async getVendedoresNoAutorizados(): Promise<Vendedor[]> {
    return this.vendedorRepository.find({
      where: { estadoAutorizacion: false }
    });
  }
} 