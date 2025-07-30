import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entidades
import { Cliente } from './entities/cliente.entity';
import { Entrega } from './entities/entrega.entity';
import { Pedido } from './entities/pedido.entity';
import { Producto } from './entities/producto.entity';
import { Proveedor } from './entities/proveedor.entity';
import { Vendedor } from './entities/vendedor.entity';
import { Venta } from './entities/venta.entity';

// Módulos
import { BodegaModule } from './modules/bodega/bodega.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { EntregasModule } from './modules/entregas/entregas.module';
import { ProductosModule } from './modules/productos/productos.module';
import { ProveedoresModule } from './modules/proveedores/proveedores.module';
import { RecursoHumanoModule } from './modules/recurso-humano/recurso-humano.module';
import { VentasModule } from './modules/ventas/ventas.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'polimarket.db',
      entities: [Cliente, Entrega, Producto, Vendedor, Venta, Pedido, Proveedor],
      synchronize: true, 
      logging: true,
    }),
    VentasModule,
    BodegaModule,
    ProveedoresModule,
    EntregasModule,
    RecursoHumanoModule,
    ClientesModule,
    ProductosModule,
  ],
})
export class AppModule {} 