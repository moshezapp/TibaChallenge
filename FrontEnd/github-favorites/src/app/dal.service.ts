
import { Repo } from './Models/Repo';
import { User } from './Models/User';
import { environment } from './../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DALService {
  server_url = environment.API_PROTOCOL + environment.API_SERVER_IP + ":" + environment.API_SERVER_PORT;
  public params = {
    "Authorization": localStorage.getItem("JWT")
  };
  public favList: Repo[] = [];
  public favEventEmitter: BehaviorSubject<Repo[]> = new BehaviorSubject<Repo[]>(this.favList);;

  constructor(
    private http: HttpClient,
  ) { }


  Search(str) {
    return this.http.get(this.server_url + `/api/search?srchStr=${str}`, { 'headers': this.params })
  }

  GetMyFavorites() {
    this.http.get(this.server_url + "/api/GetFavorites", { 'headers': this.params })
      .subscribe((res: Repo[]) => {
        this.favList = res;
        this.favEventEmitter.next(this.favList);
        return this.favEventEmitter;
      });
  }

  AddNewFavorite(repo: Repo) {
    this.http.post(this.server_url + "/api/AddFavorite", repo, { 'headers': this.params })
      .subscribe(
        result => {
          console.log("Favorite Added");
          this.GetMyFavorites(); //pull updated favs list
        },
        error => {
          console.log("ERROR in AddNewFavorite");
        },

      );
  }

  Register(user: User) {
    this.http.post(this.server_url + "/api/Register", user)
      .subscribe(
        result => {
          alert("Please login with your new user.")
        },
        error => {
          console.log("ERROR in Register", error);
          alert("Username is already taken.")
        },
      );
  }
}
