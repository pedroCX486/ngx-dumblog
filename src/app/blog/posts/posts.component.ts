import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  urlParams = new URLSearchParams(window.location.search);

  postTitle = '...';
  postContent = '...';
  timestamp = '';
  editedTimestamp = '';
  filename = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    if(this.urlParams.get('post')){
      this.loadPost();
    }
  }

  getJSON(arg): Observable<any> {
    return this.http.get("./assets/posts/"+ arg +".json");
  }

  loadPost(){
    this.getJSON(this.urlParams.get('post')).subscribe(data => {
      this.postContent = data.content;
      this.postTitle = data.title;
      this.timestamp = new Date(data.timestamp*1000).toUTCString();
      this.editedTimestamp = new Date(data.editedTimestamp*1000).toUTCString();
      this.filename = data.filename;
    }, error => {
      this.postTitle = 'Whoops!';
      this.postContent = 'Post not found!';
    });
  }

}
