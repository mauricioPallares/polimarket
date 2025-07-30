import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursoHumanoService } from './recurso-humano.service';
import { RecursoHumanoController } from './recurso-humano.controller';
import { Vendedor } from '../../entities/vendedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vendedor])],
  controllers: [RecursoHumanoController],
  providers: [RecursoHumanoService],
  exports: [RecursoHumanoService],
})
export class RecursoHumanoModule {} 