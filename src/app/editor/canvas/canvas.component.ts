import { Component, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  Editor = DecoupledEditor;
  content = {postTitle: '', timestamp: '', editedTimestamp: '', postContent: 'A new post.', filename: ''};
  archives = [];
  entryExists = false;

  filteredArchives = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadArchive();
  }

  loadArchive(){
    this.getJSON('archive').subscribe(data => {
      this.archives = data;
      this.filteredArchives = data;
    });
  }

  loadPost(file){
    this.getJSON(file).subscribe(data => {
      this.content = data;
      this.content.timestamp;
      this.content.editedTimestamp;
    });
  }

  saveAll(){
    if(this.content.postTitle == ''){
      this.content.postTitle = 'No title';
    }

    //Save post
    saveAs(new Blob([JSON.stringify(this.createPostObj(), null, 2)], {type: "text/plain;charset=utf-8;"}), this.parseFilename() + ".json");

    //Save archive but first check if we're saving some post that exists, if so, don't save the archive
    let that = this;
    if(!this.archives.some(function(element){ return element.postTitle == that.content.postTitle})){
      saveAs(new Blob([JSON.stringify(this.createArchiveObj(), null, 2)], {type: "text/plain;charset=utf-8;"}), "archive.json");
      this.entryExists = false;
    }else{
      this.entryExists = true;
    }

    this.loadArchive();
  }

  createArchiveObj(){
    this.archives.unshift({ postTitle: this.content.postTitle, timestamp: Math.round((new Date()).getTime() / 1000).toString(), filename: this.parseFilename() });
    return this.archives;
  }

  createPostObj(){
    var postContent = { postTitle: this.content.postTitle, timestamp: '', editedTimestamp: '', postContent: this.content.postContent, filename: this.parseFilename() };
  
    if(this.content.timestamp == ''){
      postContent.timestamp = Math.round((new Date()).getTime() / 1000).toString();
    }else{
      postContent.timestamp = this.content.timestamp;
      postContent.editedTimestamp = Math.round((new Date()).getTime() / 1000).toString();
    }

    return postContent;
  }

  parseFilename(){
    var filename = this.content.postTitle;

    filename = filename.replace(/[^a-zA-Z0-9_]+/gi, "-").toLowerCase();

    while(filename.endsWith("-"))
    {
      filename = filename.slice(0, -1);
    }

    return filename;
  }

  searchArhive(arg, clear?){
    if(!!arg){
      this.filteredArchives = this.archives.filter(entry => entry.postTitle.toLowerCase().includes(arg.toLowerCase()));
    }else{
      this.filteredArchives = this.archives;
    }

    if(clear){
      (<HTMLInputElement>document.getElementById("search")).value = "";
    }
  }

  loadFromFile(e) {
    var file = e.target.files[0];
    let that = this;
    var reader = new FileReader();

    if (!file) {
      return;
    }

    reader.onload = function(e) {
      var contents = (<FileReader>e.target).result;

      //I know this is crazy but it works.
      try {
        if(Object.keys(JSON.parse(contents.toString())).toString() == Object.keys(that.content).toString()){
          that.content = JSON.parse(contents.toString());
        }else{
          alert('Invalid file! Are you sure it\'s an Dumblog compatible JSON?');
          return;
        }
      } catch (e) {
        alert('Invalid file! Are you sure it\'s an Dumblog compatible JSON?');
        return;
      }
      
      document.getElementById('dismiss').click();
      (<HTMLInputElement>document.getElementById("file-input")).value = "";
    };

    reader.readAsText(file);
  }

  reset(){
    this.content = {postTitle: '', timestamp: '', editedTimestamp: '', postContent: 'A new post.', filename: ''};
  }

  parseTimestamp(timestamp){
    return new Date(timestamp*1000).toUTCString();
  }

  getJSON(arg): Observable<any> {
    return this.http.get("./assets/posts/"+ arg +".json");
  }

  editorReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
}
