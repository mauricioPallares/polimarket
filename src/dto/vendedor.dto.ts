import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateVendedorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsBoolean()
  @IsOptional()
  estadoAutorizacion?: boolean;
}

export class UpdateVendedorDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsBoolean()
  @IsOptional()
  estadoAutorizacion?: boolean;
}

export class AutorizarVendedorDto {
  @IsBoolean()
  @IsNotEmpty()
  estadoAutorizacion: boolean;
} 