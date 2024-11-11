import { Component, Inject, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import jsPDF from 'jspdf';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  currentUser: any;
  cart: any[] = [];
  precioTotal: number | null = null;

  constructor(
    private cartSvc: CartService,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
  }
  async ionViewWillEnter() {
    this.getCart();
  }

  async borrarProducto(id: string) {
    const loading = await this.utilsSvc.loading();
  await loading.present();
    await this.cartSvc.borrarProducto(id);
    this.getCart();
    loading.dismiss();
  }

  getCart() {
    this.firebaseSvc.currentUser.subscribe((user) => {
      this.currentUser = user;
      this.cartSvc.getCart(this.currentUser.uid).subscribe((cart) => {
        this.cart = cart;
        console.log(this.cart);
        this.calcularTotal();
      });
    });
  }


  ///////////////////////////////////////
  // PDF
  //////////////////////////////////////

  
  generarPDF() {
    const doc = new jsPDF();

    // Colores y estilos iniciales
    doc.setFillColor(230, 230, 230); // Color de fondo para el encabezado
    doc.setTextColor(0, 0, 0); // Color de texto
    doc.setFontSize(16);

    // Título del PDF
    let yPosition = 10; // Posición inicial Y en el PDF
    doc.text('Lista de Productos', 105, yPosition, { align: 'center' });
    yPosition += 10;

    // Dibujar encabezado de tabla
    doc.setFontSize(12);
    doc.setFillColor(200, 200, 200); // Fondo gris claro para el encabezado
    doc.rect(10, yPosition, 190, 10, 'F'); // Dibuja un rectángulo relleno para el encabezado
    doc.text('Nombre', 12, yPosition + 7);
    doc.text('Cantidad', 70, yPosition + 7);
    doc.text('Precio Unitario', 110, yPosition + 7);
    doc.text('Precio Total', 150, yPosition + 7);

    yPosition += 12; // Avanza la posición Y para el contenido

    // Imprimir cada producto con bordes y colores alternados
    let totalFinal = 0;
    this.cart.forEach((producto, index) => {
      const cantidad = 1; // Cantidad fija por producto (modifica según sea necesario)
      const precioTotal = producto.precio * cantidad;
      totalFinal += precioTotal;

      // Color de fondo alternado
      if (index % 2 === 0) {
        doc.setFillColor(240, 240, 240); // Fondo más claro
      } else {
        doc.setFillColor(255, 255, 255); // Fondo blanco
      }
      doc.rect(10, yPosition, 190, 10, 'F'); // Dibuja rectángulo de fondo para cada fila

      // Texto de cada columna
      doc.setTextColor(0, 0, 0); // Asegura color negro para el texto
      doc.text(producto.nombre, 12, yPosition + 7);
      doc.text(String(cantidad), 80, yPosition + 7, { align: 'right' });
      doc.text(String(producto.precio.toFixed(2)), 120, yPosition + 7, {
        align: 'right',
      });
      doc.text(String(precioTotal.toFixed(2)), 160, yPosition + 7, {
        align: 'right',
      });

      yPosition += 10; // Avanza la posición Y para la siguiente fila
    });

    // Línea separadora para el total
    doc.setDrawColor(0, 0, 0);
    doc.line(10, yPosition, 200, yPosition);
    yPosition += 10;

    // Total Final
    doc.setFontSize(14);
    doc.text('Total Final:', 120, yPosition);
    doc.text(String(totalFinal.toFixed(2)), 160, yPosition, { align: 'right' });

    // Guardar el PDF
    doc.save('productos.pdf');
  }

  calcularTotal() {
    if (this.cart.length > 0) {
      this.precioTotal = this.cart.reduce((acc, product) => {
        return acc + product.precio;
      }, 0);
    }
  }
}
