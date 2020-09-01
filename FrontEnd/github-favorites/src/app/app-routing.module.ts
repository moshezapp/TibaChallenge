import { AuthService } from './auth.service';
import { FavoritesComponent } from './favorites/favorites.component';
import { SearchComponent } from './search/search.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'search', component: SearchComponent, canActivate: [AuthGuardService] },
  {path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuardService] }
 // {path: 'admin-dashboard', component: AdminDashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
