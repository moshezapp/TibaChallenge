import { Repo } from './../Models/Repo';
import { DALService } from './../dal.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  public favList : Repo[] = [];
  favSubscription : Subscription;

  constructor(
    private DAL : DALService
  ) { }

  ngOnInit() {
    this.favSubscription = this.DAL.favEventEmitter.subscribe(res =>  this.favList = res);
    this.DAL.GetMyFavorites();
  }

  ngOnDestroy() {
    this.favSubscription.unsubscribe();
  }
}
