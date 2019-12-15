import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { PostModel } from 'src/app/models/post.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  urlParams = new URLSearchParams(window.location.search);

  content: PostModel = new PostModel();
  configs;

  constructor(private http: HttpClient, private titleService: Title) { }

  ngOnInit() {
    this.loadConfigs();

    if (this.urlParams.get('post')) {
      this.loadPost();
    }
  }

  loadConfigs() {
    this.getJSON('./assets/configs.json').subscribe(data => {
      this.configs = data;
    });
  }

  loadPost() {
    this.getJSON('./assets/posts/' + this.urlParams.get('post') + '.json').toPromise().then(data => {
      this.content = data;
      this.content.timestamp = !!this.content.timestamp ? new Date(data.timestamp * 1000).toUTCString() : '';
      this.content.editedTimestamp = !!this.content.editedTimestamp ? new Date(data.editedTimestamp * 1000).toUTCString() : '';
      this.titleService.setTitle(this.content.postTitle + ' - ' + this.configs.blogTitle);
    }).then(data => {
      if (this.configs.enableDisqus) {
        this.loadDisqus();
      }
    }).catch(error => {
      this.content.postTitle = 'Whoops!';
      this.content.postContent = 'We couldn\'t load this post! <strong>(' + error.status + ' ' + error.statusText + ')</strong>';
    });
  }

  getJSON(arg): Observable<any> {
    return this.http.get(arg);
  }

  loadDisqus() {
    const body = document.body as HTMLDivElement;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = './assets/disqus.js';
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
}
