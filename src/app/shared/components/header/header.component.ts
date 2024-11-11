import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

interface RouteData {
  title?: string; // Definimos title como opcional
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  title: string = '';

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Suscribirse a los cambios de la ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.activatedRoute.root.firstChild;

        // Asegúrate de que currentRoute esté definido y que tenga datos
        if (currentRoute?.snapshot.data) {
          const data: RouteData = currentRoute.snapshot.data;
          this.title = data.title || 'Título por defecto';
        } else {
          this.title = 'Título por defecto'; // Valor por defecto si no hay datos
        }
      });
  }
}
