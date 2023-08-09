import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PathName } from './shared/enum/path-name.enum';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/main.module').then((m) => m.MainModule),
    canActivate: [AuthGuard],
  },
  {
    path: PathName.LOGIN,
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
