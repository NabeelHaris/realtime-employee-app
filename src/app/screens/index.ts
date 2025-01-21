import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Employee',
    loadComponent: async () =>
      (await import('./screens.component')).ScreensComponent,
    children: [
      {
        path: 'list',
        loadComponent: async () =>
          (await import('./employee-list/employee-list.component'))
            .EmployeeListComponent,
      },
      {
        path: 'add-employee-details',
        loadComponent: async () =>
          (await import('./employee-details/employee-details.component'))
            .EmployeeDetailsComponent,
      },
      {
        path: 'edit-employee-details/:id',
        loadComponent: async () =>
          (await import('./employee-details/employee-details.component'))
            .EmployeeDetailsComponent,
      },
    ],
  },
];
