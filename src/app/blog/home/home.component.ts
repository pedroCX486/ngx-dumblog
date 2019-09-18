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
  filename = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getJSON("hello-world").subscribe(data => {
      this.postContent = data.content;
      this.postTitle = data.title;
      this.timestamp = new Date(data.timestamp*1000).toUTCString();
      this.editedTimestamp =new Date(data.editedTimestamp*1000).toUTCString();
      this.filename = data.filename;
    });
  }

  getJSON(arg): Observable<any> {
    return this.http.get("./assets/posts/"+ arg +".json");
  }

}
