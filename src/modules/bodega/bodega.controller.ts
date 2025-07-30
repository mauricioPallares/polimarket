import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { BodegaService } from './bodega.service';

@Controller('bodega')
export class BodegaController {
  constructor(private readonly bodegaService: BodegaService) {}

  @Get('productos')
  findAll() {
    return this.bodegaService.findAll();
  }

  @Get('productos/:id')
  findOne(@Param('id') id: string) {
    return this.bodegaService.findOne(id);
  }

  @Get('productos/:id/stock')
  async getStock(@Param('id') id: string) {
    const producto = await this.bodegaService.findOne(id);
    return {
      producto: producto.nombre,
      stock: producto.stock,
      disponibilidad: await this.bodegaService.obtenerDisponibilidadProducto(producto)
    };
  }

  @Get('productos/:id/proveedor')
  async getProveedor(@Param('id') id: string) {
    const producto = await this.bodegaService.findOne(id);
    return this.bodegaService.obtenerInformacionProveedor(producto);
  }

  @Patch('productos/:id/stock')
  updateStock(
    @Param('id') id: string,
    @Body() body: { cantidad: number; tipo: 'entrada' | 'salida' }
  ) {
    return this.bodegaService.updateStock(id, body.cantidad, body.tipo);
  }

  @Get('stock-bajo')
  getStockBajo(@Query('limite') limite?: string) {
    const limiteNum = limite ? parseInt(limite) : 10;
    return this.bodegaService.getStockBajo(limiteNum);
  }
} 