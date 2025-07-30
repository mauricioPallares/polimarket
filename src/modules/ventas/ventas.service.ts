import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Venta } from '../../entities/venta.entity';
import { Cliente } from '../../entities/cliente.entity';
import { Producto } from '../../entities/producto.entity';
import { Vendedor } from '../../entities/vendedor.entity';
import { CreateVentaDto, UpdateVentaDto } from '../../dto/venta.dto';
import { IConsultaProducto } from '../../interfaces/IConsultaProducto.interface';

@Injectable()
export class VentasService implements IConsultaProducto {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Vendedor)
    private vendedorRepository: Repository<Vendedor>,
  ) {}

  async registrarVenta(createVentaDto: CreateVentaDto): Promise<boolean> {
    try {
      // Verificar que el vendedor existe y está autorizado
      const vendedor = await this.vendedorRepository.findOne({
        where: { id: createVentaDto.vendedorId }
      });
      
      if (!vendedor) {
        throw new NotFoundException('Vendedor no encontrado');
      }

      if (!vendedor.estadoAutorizacion) {
        throw new BadRequestException('Vendedor no autorizado para realizar ventas');
      }

      // Verificar que el cliente existe
      const cliente = await this.clienteRepository.findOne({
        where: { id: createVentaDto.clienteId }
      });

      if (!cliente) {
        throw new NotFoundException('Cliente no encontrado');
      }

      // Verificar disponibilidad de productos
      const productos = await this.productoRepository.find({
        where: { id: In(createVentaDto.productosIds) }
      });
      
      if (productos.length !== createVentaDto.productosIds.length) {
        throw new NotFoundException('Algunos productos no fueron encontrados');
      }

      // Verificar stock disponible
      for (const producto of productos) {
        if (producto.stock <= 0) {
          throw new BadRequestException(`Producto ${producto.nombre} sin stock disponible`);
        }
      }

      // Calcular total si no se proporciona
      let total = createVentaDto.total;
      if (!total) {
        total = productos.reduce((sum, producto) => sum + Number(producto.precio), 0);
      }

      // Crear la venta
      const venta = this.ventaRepository.create({
        vendedor,
        cliente,
        productosVendidos: productos,
        fecha: createVentaDto.fecha ? new Date(createVentaDto.fecha) : new Date(),
        total,
      });

      await this.ventaRepository.save(venta);

      // Actualizar stock de productos
      for (const producto of productos) {
        producto.stock -= 1; // Asumiendo 1 unidad por producto
        await this.productoRepository.save(producto);
      }

      return true;
    } catch (error) {
      console.error('Error al registrar venta:', error);
      return false;
    }
  }

  async obtenerDisponibilidadProducto(producto: Producto): Promise<number> {
    return producto.stock;
  }

  async findAll(): Promise<Venta[]> {
    return this.ventaRepository.find({
      relations: ['vendedor', 'cliente', 'productosVendidos'],
    });
  }

  async findOne(id: string): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['vendedor', 'cliente', 'productosVendidos'],
    });

    if (!venta) {
      throw new NotFoundException('Venta no encontrada');
    }

    return venta;
  }

  async update(id: string, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne(id);

    if (updateVentaDto.vendedorId) {
      const vendedor = await this.vendedorRepository.findOne({
        where: { id: updateVentaDto.vendedorId }
      });
      if (vendedor) venta.vendedor = vendedor;
    }

    if (updateVentaDto.clienteId) {
      const cliente = await this.clienteRepository.findOne({
        where: { id: updateVentaDto.clienteId }
      });
      if (cliente) venta.cliente = cliente;
    }

    if (updateVentaDto.productosIds) {
      const productos = await this.productoRepository.find({
        where: { id: In(updateVentaDto.productosIds) }
      });
      if (productos.length === updateVentaDto.productosIds.length) {
        venta.productosVendidos = productos;
      }
    }

    if (updateVentaDto.fecha) {
      venta.fecha = new Date(updateVentaDto.fecha);
    }

    if (updateVentaDto.total) {
      venta.total = updateVentaDto.total;
    }

    return this.ventaRepository.save(venta);
  }

  async remove(id: string): Promise<void> {
    const venta = await this.findOne(id);
    await this.ventaRepository.remove(venta);
  }
} 