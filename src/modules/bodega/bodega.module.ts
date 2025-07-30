import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BodegaService } from './bodega.service';
import { BodegaController } from './bodega.controller';
import { Producto } from '../../entities/producto.entity';
import { Proveedor } from '../../entities/proveedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Proveedor])],
  controllers: [BodegaController],
  providers: [BodegaService],
  exports: [BodegaService],
})
export class BodegaModule {} 