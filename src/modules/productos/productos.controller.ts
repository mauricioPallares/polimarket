import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from '../../dto/producto.dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get('stock-bajo')
  getProductosConStockBajo(@Query('limite') limite?: string) {
    const limiteNum = limite ? parseInt(limite) : 10;
    return this.productosService.getProductosConStockBajo(limiteNum);
  }

  @Get('proveedor/:proveedorId')
  getProductosPorProveedor(@Param('proveedorId') proveedorId: string) {
    return this.productosService.getProductosPorProveedor(proveedorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Patch(':id/stock')
  actualizarStock(
    @Param('id') id: string,
    @Body() body: { cantidad: number; tipo: 'sumar' | 'restar' }
  ) {
    return this.productosService.actualizarStock(id, body.cantidad, body.tipo);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productosService.remove(id);
  }
} 