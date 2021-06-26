import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'ingredients',
        loadChildren: () => import('../modules/e-commerce/e-commerce.module').then(m => m.ECommerceModule),
      },
      {  path: '',  redirectTo: 'ingredients/list',  pathMatch: 'full',},
      {  path: '**',  redirectTo: 'error/404',},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
