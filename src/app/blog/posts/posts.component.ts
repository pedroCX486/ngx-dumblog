import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  archives = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadArchive();
  }

  getJSON(arg): Observable<any> {
    return this.http.get("./assets/posts/"+ arg +".json");
  }

  loadArchive(){
    this.getJSON('archive').subscribe(data => {
      this.archives = data;
    });
  }

}
