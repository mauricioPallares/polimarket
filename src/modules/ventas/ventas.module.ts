import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from '../../entities/venta.entity';
import { Cliente } from '../../entities/cliente.entity';
import { Producto } from '../../entities/producto.entity';
import { Vendedor } from '../../entities/vendedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, Cliente, Producto, Vendedor])],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService],
})
export class VentasModule {} 