import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PostModel } from '@shared/models/post.model';
import { HelperService } from '@shared/services/helper.service';
import { SettingsModel } from '@shared/models/settings.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  urlParams = new URLSearchParams(window.location.search);
  settings: SettingsModel;

  content: PostModel = new PostModel();

  constructor(private titleService: Title, private helperService: HelperService) { }

  ngOnInit(): void {
    // Load settings, then load post
    this.helperService.getJSON('./assets/settings.json').toPromise()
      .then((data: SettingsModel) => this.settings = data)
      .then(() => {
        if (this.urlParams.get('post')) {
          this.loadPost();
        }
      });
  }

  loadPost(): void {
    this.helperService.getJSON('./assets/posts/' + this.urlParams.get('post') + '.json').toPromise().then(data => {
      this.content = data;
      this.content.timestamp = !!this.content.timestamp ? this.helperService.parseTimestamp(data.timestamp) : '';
      this.content.editedTimestamp = !!this.content.editedTimestamp ? this.helperService.parseTimestamp(data.editedTimestamp) : '';
      this.titleService.setTitle(this.content.postTitle + ' - ' + this.settings.blogTitle);
    }).then(() => {
      if (this.settings.enableDisqus) {
        this.loadDisqus();
      }
    }).catch(error => {
      this.content.postTitle = 'Whoops!';
      this.content.postContent = 'We couldn\'t load this post! <strong>(' + error.status + ')</strong>';
    });
  }

  loadDisqus(): void {
    const body = document.body as HTMLDivElement;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = './assets/disqus.js';
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
}
