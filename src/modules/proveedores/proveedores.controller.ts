import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProveedorDto: any) {
    const proveedor = await this.proveedoresService.create(createProveedorDto);
    const resultado = await this.proveedoresService.registrarProveedor(proveedor);
    
    if (resultado) {
      return { message: 'Proveedor registrado exitosamente', proveedor, success: true };
    } else {
      return { message: 'Error al registrar el proveedor', success: false };
    }
  }

  @Get()
  findAll() {
    return this.proveedoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proveedoresService.findOne(id);
  }

  @Get(':id/productos')
  getProductos(@Param('id') id: string) {
    return this.proveedoresService.getProductosByProveedorId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProveedorDto: any) {
    return this.proveedoresService.update(id, updateProveedorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.proveedoresService.remove(id);
  }
} 