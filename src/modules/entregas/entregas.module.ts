import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntregasService } from './entregas.service';
import { EntregasController } from './entregas.controller';
import { Entrega } from '../../entities/entrega.entity';
import { Pedido } from '../../entities/pedido.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Entrega, Pedido])],
  controllers: [EntregasController],
  providers: [EntregasService],
  exports: [EntregasService],
})
export class EntregasModule {} 