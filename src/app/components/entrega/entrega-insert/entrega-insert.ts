// src/app/components/entrega/entrega-insert/entrega-insert.ts
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { EntregaService } from '../../../services/entrega-service';
import { PedidoService } from '../../../services/pedido-service';

import { Entrega } from '../../../models/Entrega';
import { Pedido } from '../../../models/Pedido';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';

// ✅ Google Maps
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  standalone: true,
  selector: 'app-entrega-insert',
  templateUrl: './entrega-insert.html',
  styleUrl: './entrega-insert.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatOptionModule,
    GoogleMapsModule, // ✅
  ],
  providers: [provideNativeDateAdapter()],
})
export class EntregaInsertComponent implements OnInit {
  form!: FormGroup;
  id: number = 0;
  edicion: boolean = false;

  listaPedidos: Pedido[] = [];

  // ✅ MAPA
  zoom = 15;
  center: google.maps.LatLngLiteral = { lat: -12.0464, lng: -77.0428 }; // Lima
  markerPosition: google.maps.LatLngLiteral | null = null;

  minEntrega: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private eS: EntregaService,
    private pS: PedidoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // Getters para no usar "?."
  get tipoEntregaField(): FormControl {
    return this.form.get('tipoEntrega') as FormControl;
  }
  get direccionEntregaField(): FormControl {
    return this.form.get('direccionEntrega') as FormControl;
  }
  get latitudEntregaField(): FormControl {
    return this.form.get('latitudEntrega') as FormControl;
  }
  get longitudEntregaField(): FormControl {
    return this.form.get('longitudEntrega') as FormControl;
  }
  get fechaEntregaField(): FormControl {
    return this.form.get('fechaEntrega') as FormControl;
  }
  get estadoEntregaField(): FormControl {
    return this.form.get('estadoEntrega') as FormControl;
  }
  get pedidoField(): FormControl {
    return this.form.get('pedido') as FormControl;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      idEntrega: [''],
      tipoEntrega: ['', [Validators.required, Validators.maxLength(100)]],
      direccionEntrega: ['', [Validators.required, Validators.maxLength(100)]],
      latitudEntrega: [0, [Validators.required]],
      longitudEntrega: [0, [Validators.required]],
      fechaEntrega: [new Date(), Validators.required],
      estadoEntrega: ['', [Validators.required, Validators.maxLength(100)]],
      pedido: ['', Validators.required], // guardamos solo el idPedido
    });

    // ✅ Si el usuario cambia lat/lng manualmente, mueve el marcador
    this.form.valueChanges.subscribe(() => this.syncMarkerFromForm(false));

    // llenar pedidos
    this.pS.list().subscribe((data) => {
      this.listaPedidos = data;
    });

    // modo edición
    this.route.params.subscribe((params: Params) => {
      this.id = Number(params['id']);
      this.edicion = this.id > 0;

      if (this.edicion) {
        this.eS.listId(this.id).subscribe((data: Entrega) => {
          this.form.patchValue({
            idEntrega: data.idEntrega,
            tipoEntrega: data.tipoEntrega,
            direccionEntrega: data.direccionEntrega,
            latitudEntrega: data.latitudEntrega,
            longitudEntrega: data.longitudEntrega,
            fechaEntrega: data.fechaEntrega,
            estadoEntrega: data.estadoEntrega,
            pedido: data.pedido.idPedido,
          });

          // ✅ centra el mapa y coloca marcador en edición
          this.syncMarkerFromForm(true);
        });
      } else {
        // ✅ opcional: centrar mapa con ubicación actual (no rellena el form)
        this.trySetCurrentLocation();
      }
    });
  }

  // ✅ Click en el mapa → actualiza lat/lng del form + marcador
  onMapClick(event: google.maps.MapMouseEvent): void {
    if (!event.latLng) return;

    const lat = Number(event.latLng.lat().toFixed(6));
    const lng = Number(event.latLng.lng().toFixed(6));

    this.markerPosition = { lat, lng };
    this.center = { lat, lng };

    this.form.patchValue({
      latitudEntrega: lat,
      longitudEntrega: lng,
    });
  }

  private syncMarkerFromForm(force: boolean): void {
    const lat = Number(this.latitudEntregaField.value);
    const lng = Number(this.longitudEntregaField.value);

    if (!isFinite(lat) || !isFinite(lng)) return;
    if (!force && (lat === 0 || lng === 0)) return;

    this.markerPosition = { lat, lng };
    this.center = { lat, lng };
  }

  private trySetCurrentLocation(): void {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        this.center = { lat, lng };
      },
      () => {
        // sin permiso -> no pasa nada
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  aceptar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {
      idEntrega: this.edicion ? Number(this.form.value.idEntrega) : 0,
      tipoEntrega: this.form.value.tipoEntrega,
      direccionEntrega: this.form.value.direccionEntrega,
      latitudEntrega: Number(this.form.value.latitudEntrega),
      longitudEntrega: Number(this.form.value.longitudEntrega),
      fechaEntrega: this.form.value.fechaEntrega,
      estadoEntrega: this.form.value.estadoEntrega,
      pedido: {
        idPedido: Number(this.form.value.pedido),
      },
    };

    const request = this.edicion ? this.eS.update(body) : this.eS.insert(body);

    request.subscribe(() => {
      this.eS.list().subscribe((data) => {
        this.eS.setList(data);
        this.router.navigate(['entrega']); // ✅ vuelve al listado
      });
    });
  }

  cancelar(): void {
    this.router.navigate(['entrega']);
  }
}
