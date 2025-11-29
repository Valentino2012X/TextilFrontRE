import { Routes } from '@angular/router';

// 🔐 autenticación
import { Autenticador } from './components/autenticador/autenticador';
import { seguridadGuard } from './guard/seguridad-guard';

// 🧭 layout general (navbar + sidebar)
import { DashboardComponent } from './components/dashboard/dashboard';

// 👥 usuarios
import { UsuarioComponent } from './components/usuario/usuario';
import { UsuarioInsertComponent } from './components/usuario/usuario-insert/usuario-insert';

export const routes: Routes = [
  // Arranque
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login (público)
  {
    path: 'login',
    component: Autenticador,
  },

  // ===== LAYOUT PROTEGIDO (DASHBOARD SIEMPRE VISIBLE) =====
  {
    path: '',
    component: DashboardComponent,
    canActivate: [seguridadGuard],
    children: [
      // HOME DEL DASHBOARD
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './components/dashboard/dashboard-home/dashboard-home'
          ).then((m) => m.DashboardHomeComponent),
      },

      // ========= USUARIOS =========
      {
        path: 'usuarios',
        component: UsuarioComponent,
        children: [
          { path: 'news', component: UsuarioInsertComponent },
          { path: 'edits/:id', component: UsuarioInsertComponent },
        ],
      },

      // ========= TIPO PRODUCTO =========
      {
        path: 'tipoproducto',
        loadComponent: () =>
          import(
            './components/tipo-producto/tipo-producto-listar/tipo-producto-listar'
          ).then((m) => m.TipoProductoListarComponent),
      },
      {
        path: 'tipoproducto/new',
        loadComponent: () =>
          import(
            './components/tipo-producto/tipo-producto-insert/tipo-producto-insert'
          ).then((m) => m.TipoProductoInsertarComponent),
      },
      {
        path: 'tipoproducto/edit/:id',
        loadComponent: () =>
          import(
            './components/tipo-producto/tipo-producto-insert/tipo-producto-insert'
          ).then((m) => m.TipoProductoInsertarComponent),
      },

      // ========= PRODUCTO =========
      {
        path: 'producto',
        loadComponent: () =>
          import('./components/producto/producto-listar/producto-listar').then(
            (m) => m.ProductoListarComponent
          ),
      },
      {
        path: 'producto/new',
        loadComponent: () =>
          import('./components/producto/producto-insert/producto-insert').then(
            (m) => m.ProductoInsertarComponent
          ),
      },
      {
        path: 'producto/edit/:id',
        loadComponent: () =>
          import('./components/producto/producto-insert/producto-insert').then(
            (m) => m.ProductoInsertarComponent
          ),
      },
      {
        path: 'producto/bprecio',
        loadComponent: () =>
          import('./components/producto/producto-reporte/producto-reporte').then(
            (m) => m.ReportePrecio
          ),
      },

      // ========= ROLES =========
      {
        path: 'roles',
        loadComponent: () =>
          import('./components/rol/rol-listar/rol-listar').then(
            (m) => m.RolListarComponent
          ),
      },
      {
        path: 'roles/new',
        loadComponent: () =>
          import('./components/rol/rol-insert/rol-insert').then(
            (m) => m.RolInsertarComponent
          ),
      },
      {
        path: 'roles/edit/:id',
        loadComponent: () =>
          import('./components/rol/rol-insert/rol-insert').then(
            (m) => m.RolInsertarComponent
          ),
      },

      // ========= MÉTODO PAGO =========
      {
        path: 'metodopago',
        loadComponent: () =>
          import(
            './components/metodo-pago/metodo-pago-listar/metodo-pago-listar'
          ).then((m) => m.MetodoPagoListarComponent),
      },
      {
        path: 'metodopago/new',
        loadComponent: () =>
          import(
            './components/metodo-pago/metodo-pago-insertar/metodo-pago-insertar'
          ).then((m) => m.MetodoPagoInsertarComponent),
      },
      {
        path: 'metodopago/edit/:id',
        loadComponent: () =>
          import(
            './components/metodo-pago/metodo-pago-insertar/metodo-pago-insertar'
          ).then((m) => m.MetodoPagoInsertarComponent),
      },

      // ========= TIPO PROYECTO =========
      {
        path: 'tipoproyecto',
        loadComponent: () =>
          import(
            './components/tipo-proyecto/tipo-proyecto-listar/tipo-proyecto-listar'
          ).then((m) => m.TipoProyectoListarComponent),
      },
      {
        path: 'tipoproyecto/new',
        loadComponent: () =>
          import(
            './components/tipo-proyecto/tipo-proyecto-insert/tipo-proyecto-insert'
          ).then((m) => m.TipoProyectoInsertarComponent),
      },
      {
        path: 'tipoproyecto/edit/:id',
        loadComponent: () =>
          import(
            './components/tipo-proyecto/tipo-proyecto-insert/tipo-proyecto-insert'
          ).then((m) => m.TipoProyectoInsertarComponent),
      },

      // ========= PROYECTO =========
      {
        path: 'proyecto',
        loadComponent: () =>
          import('./components/proyecto/proyecto-listar/proyecto-listar').then(
            (m) => m.ProyectoListarComponent
          ),
      },
      {
        path: 'proyecto/new',
        loadComponent: () =>
          import('./components/proyecto/proyecto-insert/proyecto-insert').then(
            (m) => m.ProyectoInsertarComponent
          ),
      },
      {
        path: 'proyecto/edit/:id',
        loadComponent: () =>
          import('./components/proyecto/proyecto-insert/proyecto-insert').then(
            (m) => m.ProyectoInsertarComponent
          ),
      },

      // ========= TIPO DOCUMENTO =========
      {
        path: 'tipodocumento',
        loadComponent: () =>
          import(
            './components/tipo-documento/tipo-documento-listar/tipo-documento-listar'
          ).then((m) => m.TipoDocumentoListarComponent),
      },
      {
        path: 'tipodocumento/new',
        loadComponent: () =>
          import(
            './components/tipo-documento/tipo-documento-insertar/tipo-documento-insertar'
          ).then((m) => m.TipoDocumentoInsertarComponent),
      },
      {
        path: 'tipodocumento/edit/:id',
        loadComponent: () =>
          import(
            './components/tipo-documento/tipo-documento-insertar/tipo-documento-insertar'
          ).then((m) => m.TipoDocumentoInsertarComponent),
      },

      // ========= COMENTARIO PROYECTO =========
      {
        path: 'comentarioproyecto',
        loadComponent: () =>
          import(
            './components/comentario-proyecto/comentario-proyecto-listar/comentario-proyecto-listar'
          ).then((m) => m.ComentarioProyectoListarComponent),
      },
      {
        path: 'comentarioproyecto/new',
        loadComponent: () =>
          import(
            './components/comentario-proyecto/comentario-proyecto-insert/comentario-proyecto-insert'
          ).then((m) => m.ComentarioProyectoInsertarComponent),
      },
      {
        path: 'comentarioproyecto/edit/:id',
        loadComponent: () =>
          import(
            './components/comentario-proyecto/comentario-proyecto-insert/comentario-proyecto-insert'
          ).then((m) => m.ComentarioProyectoInsertarComponent),
      },
      {
        path: 'comentarioproyecto/reporte',
        loadComponent: () =>
          import(
            './components/comentario-proyecto/comentario-proyecto-reporte/comentario-proyecto-reporte'
          ).then((m) => m.ReporteComentarios),
      },

      // ========= COMPROBANTE =========
      {
        path: 'comprobante',
        loadComponent: () =>
          import('./components/comprobante/comprobante-listar/comprobante-listar').then(
            (m) => m.ComprobanteListarComponent
          ),
      },
      {
        path: 'comprobante/new',
        loadComponent: () =>
          import('./components/comprobante/comprobante-insert/comprobante-insert').then(
            (m) => m.ComprobanteInsertarComponent
          ),
      },
      {
        path: 'comprobante/edit/:id',
        loadComponent: () =>
          import('./components/comprobante/comprobante-insert/comprobante-insert').then(
            (m) => m.ComprobanteInsertarComponent
          ),
      },
      {
        path: 'comprobante/reporte',
        loadComponent: () =>
          import('./components/comprobante/comprobante-reporte/comprobante-reporte').then(
            (m) => m.ComprobanteReporteComponent
          ),
      },
      {
        path: 'comprobante/reporte2',
        loadComponent: () =>
          import('./components/comprobante/comprobante-reporte2/comprobante-reporte2').then(
            (m) => m.ComprobanteIgvReporteComponent
          ),
      },

      // ========= PEDIDO =========
      {
        path: 'pedido',
        loadComponent: () =>
          import('./components/pedido/pedido-listar/pedido-listar').then(
            (m) => m.PedidoListarComponent
          ),
      },
      {
        path: 'pedido/new',
        loadComponent: () =>
          import('./components/pedido/pedido-insert/pedido-insert').then(
            (m) => m.PedidoInsertarComponent
          ),
      },
      {
        path: 'pedido/edit/:id',
        loadComponent: () =>
          import('./components/pedido/pedido-insert/pedido-insert').then(
            (m) => m.PedidoInsertarComponent
          ),
      },
      {
        path: 'pedido/reporte',
        loadComponent: () =>
          import('./components/pedido/pedido-reporte/pedido-reporte').then(
            (m) => m.PedidoReporte
          ),
      },

      // ========= PEDIDO ITEM =========
      {
        path: 'pedido-item',
        loadComponent: () =>
          import(
            './components/pedido-item/pedido-item-listar/pedido-item-listar'
          ).then((m) => m.PedidoItemListarComponent),
      },
      {
        path: 'pedido-item/new',
        loadComponent: () =>
          import(
            './components/pedido-item/pedido-item-insert/pedido-item-insert'
          ).then((m) => m.PedidoItemInsertComponent),
      },
      {
        path: 'pedido-item/edit/:id',
        loadComponent: () =>
          import(
            './components/pedido-item/pedido-item-insert/pedido-item-insert'
          ).then((m) => m.PedidoItemInsertComponent),
      },

      // ========= PRESUPUESTO MENSUAL =========
      {
        path: 'presupuestomensual',
        loadComponent: () =>
          import(
            './components/presupuesto-mensual/presupuesto-mensual-listar/presupuesto-mensual-listar'
          ).then((m) => m.PresupuestoMensualListarComponent),
      },
      {
        path: 'presupuestomensual/new',
        loadComponent: () =>
          import(
            './components/presupuesto-mensual/presupuesto-mensual-insert/presupuesto-mensual-insert'
          ).then((m) => m.PresupuestoMensualInsertarComponent),
      },
      {
        path: 'presupuestomensual/edit/:id',
        loadComponent: () =>
          import(
            './components/presupuesto-mensual/presupuesto-mensual-insert/presupuesto-mensual-insert'
          ).then((m) => m.PresupuestoMensualInsertarComponent),
      },

      // ========= NOTIFICACIÓN =========
      {
        path: 'notificacion',
        loadComponent: () =>
          import(
            './components/notificacion/notificacion-listar/notificacion-listar'
          ).then((m) => m.NotificacionListarComponent),
      },
      {
        path: 'notificacion/new',
        loadComponent: () =>
          import(
            './components/notificacion/notificacion-insert/notificacion-insert'
          ).then((m) => m.NotificacionInsertarComponent),
      },
      {
        path: 'notificacion/edit/:id',
        loadComponent: () =>
          import(
            './components/notificacion/notificacion-insert/notificacion-insert'
          ).then((m) => m.NotificacionInsertarComponent),
      },

      // ========= ENTREGA =========
      {
        path: 'entrega',
        loadComponent: () =>
          import('./components/entrega/entrega-listar/entrega-listar').then(
            (m) => m.EntregaListarComponent
          ),
      },
      {
        path: 'entrega/new',
        loadComponent: () =>
          import('./components/entrega/entrega-insert/entrega-insert').then(
            (m) => m.EntregaInsertComponent
          ),
      },
      {
        path: 'entrega/edit/:id',
        loadComponent: () =>
          import('./components/entrega/entrega-insert/entrega-insert').then(
            (m) => m.EntregaInsertComponent
          ),
      },
      {
        path: 'entrega/reporte',
        loadComponent: () =>
          import('./components/entrega/entrega-reporte/entrega-reporte').then(
            (m) => m.EntregaReporteComponent
          ),
      },

      // ========= CALIFICACIÓN =========
      {
        path: 'calificacion',
        loadComponent: () =>
          import(
            './components/calificacion/calificacion-listar/calificacion-listar'
          ).then((m) => m.CalificacionListarComponent),
      },
      {
        path: 'calificacion/new',
        loadComponent: () =>
          import(
            './components/calificacion/calificacion-insertar/calificacion-insertar'
          ).then((m) => m.CalificacionInsertarComponent),
      },
      {
        path: 'calificacion/edit/:id',
        loadComponent: () =>
          import(
            './components/calificacion/calificacion-insertar/calificacion-insertar'
          ).then((m) => m.CalificacionInsertarComponent),
      },

      // ========= FAVORITO =========
      {
        path: 'favorito',
        loadComponent: () =>
          import('./components/favorito/favorito-listar/favorito-listar').then(
            (m) => m.FavoritoListarComponent
          ),
      },
      {
        path: 'favorito/new',
        loadComponent: () =>
          import('./components/favorito/favorito-insert/favorito-insert').then(
            (m) => m.FavoritoInsertarComponent
          ),
      },
      {
        path: 'favorito/edit/:id',
        loadComponent: () =>
          import('./components/favorito/favorito-insert/favorito-insert').then(
            (m) => m.FavoritoInsertarComponent
          ),
      },

      // ========= PRODUCTO FOTO =========
      {
        path: 'productofoto',
        loadComponent: () =>
          import(
            './components/producto-foto/producto-foto-listar/producto-foto-listar'
          ).then((m) => m.ProductoFotoListarComponent),
      },
      {
        path: 'productofoto/new',
        loadComponent: () =>
          import(
            './components/producto-foto/producto-foto-insert/producto-foto-insert'
          ).then((m) => m.ProductoFotoInsertarComponent),
      },
      {
        path: 'productofoto/edit/:id',
        loadComponent: () =>
          import(
            './components/producto-foto/producto-foto-insert/producto-foto-insert'
          ).then((m) => m.ProductoFotoInsertarComponent),
      },

      // ========= TARJETA =========
      {
        path: 'tarjeta',
        loadComponent: () =>
          import('./components/tarjeta/tarjeta-listar/tarjeta-listar').then(
            (m) => m.TarjetaListarComponent
          ),
      },
      {
        path: 'tarjeta/new',
        loadComponent: () =>
          import('./components/tarjeta/tarjeta-insert/tarjeta-insert').then(
            (m) => m.TarjetaInsertarComponent
          ),
      },
      {
        path: 'tarjeta/reporte',
        loadComponent: () =>
          import('./components/tarjeta/tarjeta-reporte/tarjeta-reporte').then(
            (m) => m.ReporteTarjetas
          ),
      },
      {
        path: 'tarjeta/reporte2',
        loadComponent: () =>
          import('./components/tarjeta/tarjeta-reporte2/tarjeta-reporte2').then(
            (m) => m.TarjetaReporteComponent
          ),
      },
    ],
  },
];