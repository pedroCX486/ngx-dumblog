import { Component, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  postTitle = '';

  Editor = DecoupledEditor;
  editorData = 'Hello World';

  filename;

  constructor() { }

  ngOnInit() { }

  onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
  }

  save(){
    saveAs(new Blob([this.editorData], {type: "text/plain;charset=utf-8;"}), this.createFilename(this.postTitle) + ".json");
  }

  createFilename(postTitle){
    var filename = postTitle;

    if(filename == null || filename == ''){
      filename = "No Title";
    } 

    filename = filename.replace(/[^a-zA-Z0-9_]+/gi, "-").toLowerCase();

    if(filename.endsWith("-"))
    {
      filename = filename.slice(0, -1);
    }

    return filename;
  }
}
