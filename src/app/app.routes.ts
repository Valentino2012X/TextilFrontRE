import { Routes } from '@angular/router';

// 🔐 autenticación
import { Autenticador } from './components/autenticador/autenticador';
import { seguridadGuard } from './guard/seguridad-guard';
import { rolesGuard } from './guard/roles-guard';

// 🧭 layout general (navbar + sidebar)
import { DashboardComponent } from './components/dashboard/dashboard';

// 👥 usuarios
import { UsuarioComponent } from './components/usuario/usuario';
import { UsuarioInsertComponent } from './components/usuario/usuario-insert/usuario-insert';

export const routes: Routes = [
  // ✅ Arranque: Landing público
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // ✅ Login (público)
  { path: 'login', component: Autenticador },

  // ✅ Alias antiguo
  { path: 'autenticador', redirectTo: 'login', pathMatch: 'full' },

  // ✅ Registro (público) (si ya lo tienes creado)
  {
    path: 'registro',
    loadComponent: () => import('./components/registro/registro').then((m) => m.RegistroComponent),
  },

  // ✅ LANDING PÚBLICO (SIN GUARD)
  {
    path: 'home',
    loadComponent: () => import('./components/home/home/home').then((m) => m.HomeComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/home/home-index/home-index').then((m) => m.HomeIndexComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./components/home/home-about/home-about').then((m) => m.HomeAboutComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./components/home/home-products/home-products').then(
            (m) => m.HomeProductsComponent
          ),
      },
      {
        path: 'community',
        loadComponent: () =>
          import('./components/home/home-community/home-community').then(
            (m) => m.HomeCommunityComponent
          ),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./components/home/home-contact/home-contact').then((m) => m.HomeContactComponent),
      },
      {
        path: 'story',
        loadComponent: () =>
          import('./components/home/home-story/home-story').then((m) => m.HomeStoryComponent),
      },
    ],
  },

  // ===== LAYOUT PROTEGIDO (DASHBOARD) =====
  {
    path: '',
    component: DashboardComponent,
    canActivate: [seguridadGuard],
    children: [
      // HOME DEL DASHBOARD (cualquiera logueado)
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard-home/dashboard-home').then(
            (m) => m.DashboardHomeComponent
          ),
      },

      // ========= USUARIOS (ADMIN) =========
      {
        path: 'usuarios',
        component: UsuarioComponent,
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        children: [
          { path: 'news', component: UsuarioInsertComponent },
          { path: 'edits/:id', component: UsuarioInsertComponent },
        ],
      },

      // ========= ROLES (ADMIN) =========
      {
        path: 'roles',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/rol/rol-listar/rol-listar').then((m) => m.RolListarComponent),
      },
      {
        path: 'roles/new',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/rol/rol-insert/rol-insert').then((m) => m.RolInsertarComponent),
      },
      {
        path: 'roles/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/rol/rol-insert/rol-insert').then((m) => m.RolInsertarComponent),
      },

      // ========= TIPO PRODUCTO (ADMIN) =========
      {
        path: 'tipoproducto',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/tipo-producto/tipo-producto-listar/tipo-producto-listar').then(
            (m) => m.TipoProductoListarComponent
          ),
      },
      {
        path: 'tipoproducto/new',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/tipo-producto/tipo-producto-insert/tipo-producto-insert').then(
            (m) => m.TipoProductoInsertarComponent
          ),
      },
      {
        path: 'tipoproducto/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/tipo-producto/tipo-producto-insert/tipo-producto-insert').then(
            (m) => m.TipoProductoInsertarComponent
          ),
      },

      // ========= PRODUCTO =========
      // Listar/Búsqueda: ADMIN + VENDEDOR + COMPRADOR
      {
        path: 'producto',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import('./components/producto/producto-listar/producto-listar').then(
            (m) => m.ProductoListarComponent
          ),
      },
      // Insert/Edit/Delete UI solo ADMIN + VENDEDOR
      {
        path: 'producto/new',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/producto/producto-insert/producto-insert').then(
            (m) => m.ProductoInsertarComponent
          ),
      },
      {
        path: 'producto/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/producto/producto-insert/producto-insert').then(
            (m) => m.ProductoInsertarComponent
          ),
      },
      // Reporte precios: ADMIN
      {
        path: 'producto/bprecio',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/producto/producto-reporte/producto-reporte').then(
            (m) => m.ReportePrecio
          ),
      },

      // ========= PRODUCTO FOTO =========
      // Listar: ADMIN + VENDEDOR
      {
        path: 'productofoto',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/producto-foto/producto-foto-listar/producto-foto-listar').then(
            (m) => m.ProductoFotoListarComponent
          ),
      },
      // Insertar: SOLO VENDEDOR
      {
        path: 'productofoto/new',
        canActivate: [rolesGuard],
        data: { roles: ['VENDEDOR'] },
        loadComponent: () =>
          import('./components/producto-foto/producto-foto-insert/producto-foto-insert').then(
            (m) => m.ProductoFotoInsertarComponent
          ),
      },
      // Editar: ADMIN + VENDEDOR
      {
        path: 'productofoto/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/producto-foto/producto-foto-insert/producto-foto-insert').then(
            (m) => m.ProductoFotoInsertarComponent
          ),
      },

      // ========= FAVORITO (VENDEDOR + COMPRADOR) =========
      {
        path: 'favorito',
        canActivate: [rolesGuard],
        data: { roles: ['VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import('./components/favorito/favorito-listar/favorito-listar').then(
            (m) => m.FavoritoListarComponent
          ),
      },
      {
        path: 'favorito/new',
        canActivate: [rolesGuard],
        data: { roles: ['VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import('./components/favorito/favorito-insert/favorito-insert').then(
            (m) => m.FavoritoInsertarComponent
          ),
      },
      {
        path: 'favorito/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import('./components/favorito/favorito-insert/favorito-insert').then(
            (m) => m.FavoritoInsertarComponent
          ),
      },

      // ========= CALIFICACIÓN =========
      // Listar: todos (ADMIN lista + elimina; V/C insert/mod en sus pantallas)
      {
        path: 'calificacion',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import('./components/calificacion/calificacion-listar/calificacion-listar').then(
            (m) => m.CalificacionListarComponent
          ),
      },
      // new/edit: SOLO VENDEDOR + COMPRADOR
      {
        path: 'calificacion/new',
        canActivate: [rolesGuard],
        data: { roles: ['VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import('./components/calificacion/calificacion-insertar/calificacion-insertar').then(
            (m) => m.CalificacionInsertarComponent
          ),
      },
      {
        path: 'calificacion/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import('./components/calificacion/calificacion-insertar/calificacion-insertar').then(
            (m) => m.CalificacionInsertarComponent
          ),
      },

      // ========= TIPO PROYECTO (ADMIN + VENDEDOR) =========
      {
        path: 'tipoproyecto',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/tipo-proyecto/tipo-proyecto-listar/tipo-proyecto-listar').then(
            (m) => m.TipoProyectoListarComponent
          ),
      },
      {
        path: 'tipoproyecto/new',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/tipo-proyecto/tipo-proyecto-insert/tipo-proyecto-insert').then(
            (m) => m.TipoProyectoInsertarComponent
          ),
      },
      {
        path: 'tipoproyecto/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/tipo-proyecto/tipo-proyecto-insert/tipo-proyecto-insert').then(
            (m) => m.TipoProyectoInsertarComponent
          ),
      },

      // ========= PROYECTO (ADMIN + VENDEDOR) =========
      {
        path: 'proyecto',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/proyecto/proyecto-listar/proyecto-listar').then(
            (m) => m.ProyectoListarComponent
          ),
      },
      {
        path: 'proyecto/new',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/proyecto/proyecto-insert/proyecto-insert').then(
            (m) => m.ProyectoInsertarComponent
          ),
      },
      {
        path: 'proyecto/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/proyecto/proyecto-insert/proyecto-insert').then(
            (m) => m.ProyectoInsertarComponent
          ),
      },

      // ========= COMENTARIO PROYECTO =========
      // Listar: todos
      {
        path: 'comentarioproyecto',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import(
            './components/comentario-proyecto/comentario-proyecto-listar/comentario-proyecto-listar'
          ).then((m) => m.ComentarioProyectoListarComponent),
      },
      // new: VENDEDOR + COMPRADOR
      {
        path: 'comentarioproyecto/new',
        canActivate: [rolesGuard],
        data: { roles: ['VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import(
            './components/comentario-proyecto/comentario-proyecto-insert/comentario-proyecto-insert'
          ).then((m) => m.ComentarioProyectoInsertarComponent),
      },
      // edit: ADMIN + VENDEDOR + COMPRADOR
      {
        path: 'comentarioproyecto/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import(
            './components/comentario-proyecto/comentario-proyecto-insert/comentario-proyecto-insert'
          ).then((m) => m.ComentarioProyectoInsertarComponent),
      },
      // reporte: ADMIN (si lo quieres también para VENDEDOR, añade 'VENDEDOR')
      {
        path: 'comentarioproyecto/reporte',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import(
            './components/comentario-proyecto/comentario-proyecto-reporte/comentario-proyecto-reporte'
          ).then((m) => m.ReporteComentarios),
      },

      // ========= COMPROBANTE (ADMIN + VENDEDOR) =========
      {
        path: 'comprobante',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/comprobante/comprobante-listar/comprobante-listar').then(
            (m) => m.ComprobanteListarComponent
          ),
      },
      {
        path: 'comprobante/new',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/comprobante/comprobante-insert/comprobante-insert').then(
            (m) => m.ComprobanteInsertarComponent
          ),
      },
      {
        path: 'comprobante/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/comprobante/comprobante-insert/comprobante-insert').then(
            (m) => m.ComprobanteInsertarComponent
          ),
      },
      {
        path: 'comprobante/reporte',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/comprobante/comprobante-reporte/comprobante-reporte').then(
            (m) => m.ComprobanteReporteComponent
          ),
      },
      {
        path: 'comprobante/reporte2',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/comprobante/comprobante-reporte2/comprobante-reporte2').then(
            (m) => m.ComprobanteIgvReporteComponent
          ),
      },

      // ========= PEDIDO (ADMIN + VENDEDOR + COMPRADOR) =========
      {
        path: 'pedido',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import('./components/pedido/pedido-listar/pedido-listar').then(
            (m) => m.PedidoListarComponent
          ),
      },
      {
        path: 'pedido/new',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import('./components/pedido/pedido-insert/pedido-insert').then(
            (m) => m.PedidoInsertarComponent
          ),
      },
      {
        path: 'pedido/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import('./components/pedido/pedido-insert/pedido-insert').then(
            (m) => m.PedidoInsertarComponent
          ),
      },
      {
        path: 'pedido/reporte',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/pedido/pedido-reporte/pedido-reporte').then((m) => m.PedidoReporte),
      },

      // ========= PEDIDO ITEM =========
      // Listar: ADMIN + COMPRADOR
      {
        path: 'pedido-item',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'COMPRADOR'] },
        loadComponent: () =>
          import('./components/pedido-item/pedido-item-listar/pedido-item-listar').then(
            (m) => m.PedidoItemListarComponent
          ),
      },
      // new/edit: SOLO COMPRADOR
      {
        path: 'pedido-item/new',
        canActivate: [rolesGuard],
        data: { roles: ['COMPRADOR'] },
        loadComponent: () =>
          import('./components/pedido-item/pedido-item-insert/pedido-item-insert').then(
            (m) => m.PedidoItemInsertComponent
          ),
      },
      {
        path: 'pedido-item/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['COMPRADOR'] },
        loadComponent: () =>
          import('./components/pedido-item/pedido-item-insert/pedido-item-insert').then(
            (m) => m.PedidoItemInsertComponent
          ),
      },

      // ========= ENTREGA (ADMIN + VENDEDOR) =========
      {
        path: 'entrega',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/entrega/entrega-listar/entrega-listar').then(
            (m) => m.EntregaListarComponent
          ),
      },
      {
        path: 'entrega/new',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/entrega/entrega-insert/entrega-insert').then(
            (m) => m.EntregaInsertComponent
          ),
      },
      {
        path: 'entrega/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/entrega/entrega-insert/entrega-insert').then(
            (m) => m.EntregaInsertComponent
          ),
      },
      {
        path: 'entrega/reporte',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR'] },
        loadComponent: () =>
          import('./components/entrega/entrega-reporte/entrega-reporte').then(
            (m) => m.EntregaReporteComponent
          ),
      },
      // ========= PAGO (TODOS PUEDEN) =========
      {
        path: 'pago/paypal',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR', 'ESTUDIANTE'] }, // 👈 TODOS
        loadComponent: () =>
          import('./components/pago/pago-paypal/pago-paypal').then((m) => m.PagoPaypalComponent),
      },

      // ========= MÉTODO PAGO (ADMIN) =========
      {
        path: 'metodopago',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/metodo-pago/metodo-pago-listar/metodo-pago-listar').then(
            (m) => m.MetodoPagoListarComponent
          ),
      },
      {
        path: 'metodopago/new',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/metodo-pago/metodo-pago-insertar/metodo-pago-insertar').then(
            (m) => m.MetodoPagoInsertarComponent
          ),
      },
      {
        path: 'metodopago/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/metodo-pago/metodo-pago-insertar/metodo-pago-insertar').then(
            (m) => m.MetodoPagoInsertarComponent
          ),
      },

      // ========= TARJETA =========
      // Listar: todos
      {
        path: 'tarjeta',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import('./components/tarjeta/tarjeta-listar/tarjeta-listar').then(
            (m) => m.TarjetaListarComponent
          ),
      },
      // Insertar: SOLO VENDEDOR + COMPRADOR
      {
        path: 'tarjeta/new',
        canActivate: [rolesGuard],
        data: { roles: ['VENDEDOR', 'COMPRADOR'] },
        loadComponent: () =>
          import('./components/tarjeta/tarjeta-insert/tarjeta-insert').then(
            (m) => m.TarjetaInsertarComponent
          ),
      },
      // reportes: ADMIN
      {
        path: 'tarjeta/reporte',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/tarjeta/tarjeta-reporte/tarjeta-reporte').then(
            (m) => m.ReporteTarjetas
          ),
      },
      {
        path: 'tarjeta/reporte2',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/tarjeta/tarjeta-reporte2/tarjeta-reporte2').then(
            (m) => m.TarjetaReporteComponent
          ),
      },

      // ========= TIPO DOCUMENTO (ADMIN) =========
      {
        path: 'tipodocumento',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/tipo-documento/tipo-documento-listar/tipo-documento-listar').then(
            (m) => m.TipoDocumentoListarComponent
          ),
      },
      {
        path: 'tipodocumento/new',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import(
            './components/tipo-documento/tipo-documento-insertar/tipo-documento-insertar'
          ).then((m) => m.TipoDocumentoInsertarComponent),
      },
      {
        path: 'tipodocumento/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import(
            './components/tipo-documento/tipo-documento-insertar/tipo-documento-insertar'
          ).then((m) => m.TipoDocumentoInsertarComponent),
      },

      // ========= PRESUPUESTO MENSUAL =========
      // Listar: ADMIN + COMPRADOR
      {
        path: 'presupuestomensual',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'COMPRADOR'] },
        loadComponent: () =>
          import(
            './components/presupuesto-mensual/presupuesto-mensual-listar/presupuesto-mensual-listar'
          ).then((m) => m.PresupuestoMensualListarComponent),
      },
      // new: SOLO COMPRADOR
      {
        path: 'presupuestomensual/new',
        canActivate: [rolesGuard],
        data: { roles: ['COMPRADOR'] },
        loadComponent: () =>
          import(
            './components/presupuesto-mensual/presupuesto-mensual-insert/presupuesto-mensual-insert'
          ).then((m) => m.PresupuestoMensualInsertarComponent),
      },
      // edit: ADMIN + COMPRADOR
      {
        path: 'presupuestomensual/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN', 'COMPRADOR'] },
        loadComponent: () =>
          import(
            './components/presupuesto-mensual/presupuesto-mensual-insert/presupuesto-mensual-insert'
          ).then((m) => m.PresupuestoMensualInsertarComponent),
      },

      // ========= NOTIFICACIÓN (ADMIN) =========
      {
        path: 'notificacion',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/notificacion/notificacion-listar/notificacion-listar').then(
            (m) => m.NotificacionListarComponent
          ),
      },
      {
        path: 'notificacion/new',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/notificacion/notificacion-insert/notificacion-insert').then(
            (m) => m.NotificacionInsertarComponent
          ),
      },
      {
        path: 'notificacion/edit/:id',
        canActivate: [rolesGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./components/notificacion/notificacion-insert/notificacion-insert').then(
            (m) => m.NotificacionInsertarComponent
          ),
      },
    ],
  },

  // ✅ fallback
  { path: '**', redirectTo: 'home' },
];
