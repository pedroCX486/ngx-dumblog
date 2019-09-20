import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  urlParams = new URLSearchParams(window.location.search);

  content = {postTitle: '', timestamp: '', editedTimestamp: '', postContent: '', filename: ''};
  configs;

  constructor(private http: HttpClient, private titleService: Title) { }

  ngOnInit() {
    this.loadConfigs();

    if(this.urlParams.get('post')){
      this.loadPost();
    }
  }

  getJSON(arg): Observable<any> {
    return this.http.get(arg);
  }

  loadConfigs(){
    this.getJSON("./assets/configs.json").subscribe(data => {
      this.configs = data;

      if(this.configs.enableDisqus){
        this.loadDisqus();
      }
    });
  }

  loadPost(){
    this.getJSON("./assets/posts/"+ this.urlParams.get('post') +".json").subscribe(data => {
      this.content = data;
      this.content.timestamp = new Date(data.timestamp*1000).toUTCString();
      this.content.editedTimestamp = new Date(data.editedTimestamp*1000).toUTCString();

      this.titleService.setTitle(this.content.postTitle + " - " + this.configs.blogTitle);
    }, error => {
      this.content = {postTitle: 'Whoops!', timestamp: '', editedTimestamp: '', postContent: 'Post not found!', filename: ''};
    });
  }

  loadDisqus(){
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = './assets/disqus.js';
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
}
