import { JwtHelperService, JwtModule, JwtModuleOptions } from '@auth0/angular-jwt';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ReactiveFormsModule } from '@angular/forms';

const JWT_Module_Options: JwtModuleOptions = {
  config: {}
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchComponent,
    FavoritesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    JwtModule.forRoot(JWT_Module_Options),

    
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
