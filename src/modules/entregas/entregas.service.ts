import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entrega } from '../../entities/entrega.entity';
import { Pedido } from '../../entities/pedido.entity';
import { CreateEntregaDto, UpdateEntregaDto } from '../../dto/entrega.dto';

@Injectable()
export class EntregasService {
  constructor(
    @InjectRepository(Entrega)
    private entregaRepository: Repository<Entrega>,
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
  ) {}

  async create(createEntregaDto: CreateEntregaDto): Promise<Entrega> {
    const pedido = await this.pedidoRepository.findOne({
      where: { id: createEntregaDto.pedidoId },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    const entrega = this.entregaRepository.create({
      ...createEntregaDto,
      pedido,
    });

    return this.entregaRepository.save(entrega);
  }

  async findAll(): Promise<Entrega[]> {
    return this.entregaRepository.find({
      relations: ['pedido', 'pedido.venta'],
    });
  }

  async findOne(id: string): Promise<Entrega> {
    const entrega = await this.entregaRepository.findOne({
      where: { id },
      relations: ['pedido', 'pedido.venta'],
    });

    if (!entrega) {
      throw new NotFoundException('Entrega no encontrada');
    }

    return entrega;
  }

  async update(id: string, updateEntregaDto: UpdateEntregaDto): Promise<Entrega> {
    const entrega = await this.findOne(id);
    
    Object.assign(entrega, updateEntregaDto);
    
    return this.entregaRepository.save(entrega);
  }

  async remove(id: string): Promise<void> {
    const entrega = await this.findOne(id);
    await this.entregaRepository.remove(entrega);
  }

  async findByPedido(pedidoId: string): Promise<Entrega[]> {
    return this.entregaRepository.find({
      where: { pedido: { id: pedidoId } },
      relations: ['pedido', 'pedido.venta'],
    });
  }

  async findByEstado(estado: string): Promise<Entrega[]> {
    return this.entregaRepository.find({
      where: { estado },
      relations: ['pedido', 'pedido.venta'],
    });
  }
} 