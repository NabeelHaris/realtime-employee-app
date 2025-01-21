import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'employee/list',
        pathMatch: 'full',
        title: 'Employee Record',
    },
    {
        path:'employee',
        loadChildren: async () => (await import('./screens')).routes,
    }
];
