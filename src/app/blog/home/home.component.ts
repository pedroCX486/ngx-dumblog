import { Component, OnInit } from '@angular/core';
import { ISettings } from '@shared/interfaces/settings.interface';
import { IArchive } from '@shared/interfaces/archive.interface';
import { IPost } from '@shared/interfaces/post.interface';
import { HelperService } from '@shared/services/helper.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  contents: IPost[] = [];
  archives: IArchive[] = [];
  settings!: ISettings;

  postsLoaded = 0;

  constructor(public helperService: HelperService) { }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.helperService.getSettings().subscribe({
      next: data => {
        this.settings = data;
      },
      complete: () => {
        this.loadArchive();
      }
    });
  }

  loadArchive(): void {
    this.helperService.getArchive().subscribe({
      next: data => {
        this.archives = data;
        this.settings.maxPosts = this.archives.length < this.settings.maxPosts ? this.archives.length : this.settings.maxPosts;
      },
      complete: () => {
        this.loadPosts();
      }
    });
  }

  loadPosts(): void {
    if (this.postsLoaded < this.settings.maxPosts) {
      this.helperService.getPost(this.archives[this.postsLoaded].filename).subscribe({
        next: (data: IPost) => {
          this.contents.push(data);
        },
        error: error => {
          this.continue(error);
        },
        complete: () => {
          this.continue();
        }
      });
    }
  }

  continue(error?: any): void {
    if (!!error) {
      const errorPost = <IPost>{};
      errorPost.postTitle = 'Aw shucks!';
      errorPost.postContent = 'We couldn\'t load this post! Sorry! <strong>(' + error.status + ' ' + error.statusText + ')</strong>';
      errorPost.filename = 'not-found';
      this.contents.push(errorPost);
    }

    this.postsLoaded += 1;
    this.loadPosts();
  }
}
