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
  content = {postTitle: '', timestamp: '', editedTimestamp: '', postContent: 'A new post...', filename: ''};
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
      this.content = data;
      this.content.timestamp = new Date(data.timestamp*1000).toUTCString();
      this.content.editedTimestamp = new Date(data.editedTimestamp*1000).toUTCString();
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
    }else{
      this.entryExists = true;
    }
  }

  createArchiveObj(){
    var archive = { postTitle: this.content.postTitle, filename: this.parseFilename() };
    this.archives.unshift(archive);

    return this.archives;
  }

  createPostObj(){
    var postContent = { postTitle: this.content.postTitle, timestamp: '', editedTimestamp: '', postContent: this.content.postContent, filename: this.parseFilename() };
    if(this.content.timestamp == ''){
      postContent.timestamp = Math.round((new Date()).getTime() / 1000).toString();
    }else{
      postContent.timestamp = Math.round((new Date(this.content.timestamp)).getTime() / 1000).toString();
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

  reset(){
    this.content = {postTitle: '', timestamp: '', editedTimestamp: '', postContent: '', filename: ''};
  }
}
