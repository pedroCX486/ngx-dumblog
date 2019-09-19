import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  contents = [];
  archives = [];
  configs;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // this.getJSON("./assets/posts/hello-world.json").subscribe(data => {
    //   this.content = data;
    //   this.content.timestamp = new Date(data.timestamp*1000).toUTCString();
    //   this.content.editedTimestamp = new Date(data.editedTimestamp*1000).toUTCString();
    // }, error => {
    //   this.content = {postTitle: 'Aw shucks!', timestamp: '', editedTimestamp: '', postContent: 'We couldn\'t load this post! Sorry!', filename: ''};
    // });
    this.loadConfigs();
  }

  getJSON(arg): Observable<any> {
    return this.http.get(arg);
  }

  loadConfigs(){
    this.getJSON("./assets/configs.json").subscribe(data => {
      this.configs = data;
      this.loadArchive();
    });
  }

  loadArchive(){
    this.getJSON("./assets/posts/archive.json").subscribe(data => {
      this.archives = data;

      if(this.archives.length < this.configs.maxPosts){
        this.configs.maxPosts = this.archives.length;
      }

      this.loadPosts();
    });
  }

  loadPosts(){
    for(var i = 0; i < this.configs.maxPosts; i++){
      this.getJSON("./assets/posts/"+ this.archives[i].filename +".json").subscribe(data => {
        this.contents.push(data);
      }, error => {
        this.contents.push({postTitle: 'Aw shucks!', timestamp: '', editedTimestamp: '', postContent: 'We couldn\'t load this post! Sorry!', filename: ''});
      });
    }
  }

  parseTimestamp(timestamp){
    return new Date(timestamp*1000).toUTCString();
  }

}