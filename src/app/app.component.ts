import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './ components/header/header.component';
import * as localforage from 'localforage';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'realtime-employee-list';

  constructor() {
    // Initialize localForage
    localforage.config({
      name: 'EmployeeDB',
      storeName: 'employee_details',
      description: 'Stores employee form data',
    });
  }
}
