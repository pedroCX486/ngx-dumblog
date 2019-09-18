import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  postTitle = '';
  postContent = '';
  timestamp = '';
  editedTimestamp = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getJSON("hello-world").subscribe(data => {
      this.postContent = data.content;
      this.postTitle = data.title;
      this.timestamp = data.timestamp;
      this.editedTimestamp = data.editedTimestamp;
    });
  }

  getJSON(arg): Observable<any> {
    return this.http.get("./assets/posts/"+ arg +".json");
  }

}
