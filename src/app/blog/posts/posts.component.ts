import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IPost } from '@shared/interfaces/post.interface';
import { HelperService } from '@shared/services/helper.service';
import { ISettings } from '@shared/interfaces/settings.interface';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  urlParams = new URLSearchParams(window.location.search);
  settings!: ISettings;

  content!: IPost;

  constructor(private titleService: Title, private helperService: HelperService) { }

  ngOnInit(): void {
    // Load settings, then load post
    this.helperService.getSettings().subscribe({
      next: (data: ISettings) => {
        this.settings = data
      }, complete: () => {
        if (this.urlParams.get('post')) {
          this.loadPost();
        }
      }
    });
  }

  loadPost(): void {
    this.helperService.getPost(this.urlParams.get('post')!).subscribe({
      next: (data: IPost) => {
        this.content = data;
        this.content.timestamp = !!this.content.timestamp ? this.helperService.parseTimestamp(data.timestamp) : '';
        this.content.editedTimestamp = !!this.content.editedTimestamp ? this.helperService.parseTimestamp(data.editedTimestamp) : '';
        this.titleService.setTitle(this.content.postTitle + ' - ' + this.settings.blogTitle);
      },
      error: error => {
        this.content.postTitle = 'Whoops!';
        this.content.postContent = 'We couldn\'t load this post! <strong>(' + error.status + ')</strong>';
      },
      complete: () => {
        if (this.settings.enableDisqus) {
          this.loadDisqus();
        }
      }
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
