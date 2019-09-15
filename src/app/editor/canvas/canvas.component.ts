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

  postTitle = '';
  Editor = DecoupledEditor;
  editorData = 'A new post...';
  filename;
  archives;

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  loadArchive(){
    this.getJSON('archive').subscribe(data => {
      this.archives = data;
    });
  }

  loadPost(file){
    this.getJSON(file).subscribe(data => {
      this.editorData = data.content;
      this.postTitle = data.title;
    });
  }

  saveAll(){
    saveAs(new Blob([this.editorData], {type: "text/plain;charset=utf-8;"}), this.parseFilename(this.postTitle) + ".json");
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

  parseFilename(postTitle){
    var filename = postTitle;

    if(filename == null || filename == ''){
      return filename = "no-title";
    }

    filename = filename.replace(/[^a-zA-Z0-9_]+/gi, "-").toLowerCase();

    while(filename.endsWith("-"))
    {
      filename = filename.slice(0, -1);
    }

    return filename;
  }
}
