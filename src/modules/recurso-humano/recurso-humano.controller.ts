import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { RecursoHumanoService } from './recurso-humano.service';
import { CreateVendedorDto, UpdateVendedorDto, AutorizarVendedorDto } from '../../dto/vendedor.dto';

@Controller('recurso-humano')
export class RecursoHumanoController {
  constructor(private readonly recursoHumanoService: RecursoHumanoService) {}

  @Post('vendedores')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVendedorDto: CreateVendedorDto) {
    return this.recursoHumanoService.create(createVendedorDto);
  }

  @Get('vendedores')
  findAll() {
    return this.recursoHumanoService.findAll();
  }

  @Get('vendedores/autorizados')
  getVendedoresAutorizados() {
    return this.recursoHumanoService.getVendedoresAutorizados();
  }

  @Get('vendedores/no-autorizados')
  getVendedoresNoAutorizados() {
    return this.recursoHumanoService.getVendedoresNoAutorizados();
  }

  @Get('vendedores/:id')
  findOne(@Param('id') id: string) {
    return this.recursoHumanoService.findOne(id);
  }

  @Patch('vendedores/:id')
  update(@Param('id') id: string, @Body() updateVendedorDto: UpdateVendedorDto) {
    return this.recursoHumanoService.update(id, updateVendedorDto);
  }

  @Post('vendedores/:id/autorizar')
  @HttpCode(HttpStatus.OK)
  async autorizarVendedor(@Param('id') id: string, @Body() autorizarDto: AutorizarVendedorDto) {
    const vendedor = await this.recursoHumanoService.autorizarVendedorById(id, autorizarDto);
    return { 
      message: `Vendedor ${vendedor.estadoAutorizacion ? 'autorizado' : 'desautorizado'} exitosamente`, 
      vendedor,
      success: true 
    };
  }

  @Delete('vendedores/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.recursoHumanoService.remove(id);
  }
} 