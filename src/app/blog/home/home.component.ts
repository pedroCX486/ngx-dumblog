import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigModel } from 'src/app/models/config.model';
import { ArchiveModel } from 'src/app/models/archive.model';
import { PostModel } from 'src/app/models/post.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  contents: PostModel[] = [];
  archives: ArchiveModel[] = [];
  configs: ConfigModel;
  postsLoaded = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadConfigs();
  }

  loadConfigs() {
    this.getJSON('./assets/configs.json').toPromise().then((data) => {
      this.configs = data;
    }).then(data => this.loadArchive());
  }

  loadArchive() {
    this.getJSON('./assets/posts/archive.json').toPromise().then(data => {
      this.archives = data;
      this.configs.maxPosts = this.archives.length < this.configs.maxPosts ? this.archives.length : this.configs.maxPosts;
    }).then(data => this.loadPosts());
  }

  loadPosts() {
    if (this.postsLoaded < this.configs.maxPosts) {
      this.getJSON('./assets/posts/' + this.archives[this.postsLoaded].filename + '.json').toPromise().then(data => {
        this.contents.push(data);
      }).then(data => {
        this.continue();
      }).catch(error => {
        this.continue(error);
      });
    }
  }

  continue(error?) {
    if (error) {
      const errorPost = new PostModel();
      errorPost.postTitle = 'Aw shucks!';
      errorPost.postContent = 'We couldn\'t load this post! Sorry! <strong>(' + error.status + ' ' + error.statusText + ')</strong>';
      errorPost.filename = 'not-found';
      this.contents.push(errorPost);
    }

    this.postsLoaded += 1;
    this.loadPosts();
  }

  parseTimestamp(timestamp) {
    return new Date(timestamp * 1000).toUTCString();
  }

  getJSON(arg): Observable<any> {
    return this.http.get(arg);
  }
}
