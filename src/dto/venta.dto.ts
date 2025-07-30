import { IsString, IsNotEmpty, IsNumber, IsPositive, IsArray, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateVentaDto {
  @IsUUID()
  @IsNotEmpty()
  vendedorId: string;

  @IsUUID()
  @IsNotEmpty()
  clienteId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  productosIds: string[];

  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  total?: number;
}

export class UpdateVentaDto {
  @IsUUID()
  @IsOptional()
  vendedorId?: string;

  @IsUUID()
  @IsOptional()
  clienteId?: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  productosIds?: string[];

  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  total?: number;
} 