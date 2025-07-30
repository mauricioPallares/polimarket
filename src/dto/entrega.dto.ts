import { IsUUID, IsDate, IsString, IsIn } from 'class-validator';

export class CreateEntregaDto {
  @IsUUID()
  pedidoId: string;

  @IsDate()
  fechaEntrega: Date;

  @IsString()
  @IsIn(['pendiente', 'en_camino', 'entregado', 'cancelado'])
  estado: string;
}

export class UpdateEntregaDto {
  @IsDate()
  fechaEntrega?: Date;

  @IsString()
  @IsIn(['pendiente', 'en_camino', 'entregado', 'cancelado'])
  estado?: string;
} 