import { FormBuilder } from '@angular/forms';
import { Repo } from './../Models/Repo';
import { DALService } from './../dal.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  reposList : Repo[] = [];
  SearchForm : any;
  favList : Repo[] = [];
  favSubscription : Subscription;

  constructor(
    private DAL : DALService,
    private formBuilder: FormBuilder
  ) { 
    this.favSubscription = this.DAL.favEventEmitter.subscribe(res => this.favList = res);
    this.DAL.GetMyFavorites();

    this.SearchForm =  this.formBuilder.group({
      'inputSearch' : [''],
      'searchResults' : ['']
    });
  }

  ngOnInit() {

  }

  Search() {
    var searchStr = this.SearchForm.get('inputSearch').value
    this.DAL.Search(searchStr).toPromise()
    .then((res : Repo[]) => {
      this.reposList = res.filter(x => !this.favList.find(e => e.id == x.id));
    }) 
    .catch(err => {
      console.log("ERROR RESPONSE");
      return false;
    });
  }

  AddToFavorites() {
    var repoID = this.SearchForm.get('searchResults').value;
    var repo = this.reposList.filter(x => x.id == repoID).pop();
    this.DAL.AddNewFavorite(repo);
  }

  ngOnDestroy() {
    this.favSubscription.unsubscribe();
  }
}
