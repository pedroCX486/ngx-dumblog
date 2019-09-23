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

  content = {postTitle: '', timestamp: '', editedTimestamp: '', postContent: '', filename: '', draft: ''};
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
    });
  }

  loadPost(){
    this.getJSON("./assets/posts/"+ this.urlParams.get('post') +".json").subscribe(data => {
      this.content = data;

      if(data.timestamp){
        this.content.timestamp = new Date(data.timestamp*1000).toUTCString();
      }else{
        this.content.draft = "Draft: Post not published."
      }


      if(data.editedTimestamp){
        this.content.editedTimestamp = new Date(data.editedTimestamp*1000).toUTCString();
      }
      
      this.titleService.setTitle(this.content.postTitle + " - " + this.configs.blogTitle);

      if(this.configs.enableDisqus){
        this.loadDisqus();
      }
    }, error => {
      this.content.postTitle = "Whoops!";
      this.content.postContent = "Post not found!";
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
