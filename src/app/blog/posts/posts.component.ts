import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    console.log(this.urlParams.get('post'))
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
      this.timestamp = data.timestamp;
      this.editedTimestamp = data.editedTimestamp;
    }, error => {
      this.postTitle = 'Whoops!';
      this.postContent = 'Post not found!';
    });
  }

}
