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
  postTitle = '';
  postContent = 'A new post...';
  timestamp = '';
  editedTimestamp = '';

  archives = [];

  entryExists = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadArchive();
  }

  editorReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  getJSON(arg): Observable<any> {
    return this.http.get("./assets/posts/"+ arg +".json");
  }

  loadArchive(){
    this.getJSON('archive').subscribe(data => {
      this.archives = data;
    });
  }

  loadPost(file){
    this.getJSON(file).subscribe(data => {
      this.postContent = data.content;
      this.postTitle = data.title;
      this.timestamp = data.timestamp;
      this.editedTimestamp = data.editedTimestamp;
    });
  }

  saveAll(){
    if(this.postTitle == null || this.postTitle == ''){
      this.postTitle = 'No title';
    }

    //Save post
    saveAs(new Blob([JSON.stringify(this.createPostObj(), null, 2)], {type: "text/plain;charset=utf-8;"}), this.parseFilename() + ".json");

    //Save archive but first check if we're saving some post that exists, if so, don't save the archive
    let that = this;
    if(!this.archives.some(function(element){ return element.postTitle == that.postTitle})){
      saveAs(new Blob([JSON.stringify(this.createArchiveObj(), null, 2)], {type: "text/plain;charset=utf-8;"}), "archive.json");
    }else{
      this.entryExists = true;
    }
  }

  createArchiveObj(){
    var archive = { postTitle: this.postTitle, filename: this.parseFilename() };
    this.archives.unshift(archive);

    return this.archives;
  }

  createPostObj(){
    var postContent = { title: this.postTitle, timestamp: '', editedTimestamp: '', content: this.postContent };
    if(this.timestamp == null || this.timestamp == ''){
      postContent.timestamp = Date.now().toString();
    }else{
      postContent.timestamp = this.timestamp;
      postContent.editedTimestamp = Date.now().toString();
    }

    return postContent;
  }

  parseFilename(){
    var filename = this.postTitle;

    filename = filename.replace(/[^a-zA-Z0-9_]+/gi, "-").toLowerCase();

    while(filename.endsWith("-"))
    {
      filename = filename.slice(0, -1);
    }

    return filename;
  }

  reset(){
    this.postTitle = '';
    this.postContent = 'A new post...';
    this.timestamp = '';
    this.editedTimestamp = '';
  }
}
