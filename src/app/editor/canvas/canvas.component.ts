import { Component, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostModel } from 'src/app/models/post.model';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  Editor = DecoupledEditor;
  content: PostModel = new PostModel();
  archives = [];
  filteredArchives = [];
  entryExists = false;

  constructor(private http: HttpClient) {
    this.resetEditor();
  }

  ngOnInit() {
    this.loadArchive();
  }

  loadArchive() {
    this.getJSON('archive').subscribe(data => {
      this.archives = data;
      this.filteredArchives = data;
    });
  }

  loadPost(file) {
    this.getJSON(file).subscribe(data => {
      this.content = data;
    });
  }

  savePost(isDraft) {
    this.content.draft = isDraft;

    if (!this.content.postTitle) {
      this.content.postTitle = 'No title.';
    }

    if (!this.content.postContent) {
      this.content.postContent = 'No content.';
    }

    if (isDraft) {
      // Save post as draft (no timestamps)
      this.content.filename = this.parseFilename();

      saveAs(new Blob(
        [JSON.stringify(this.content, null, 2)], { type: 'text/plain;charset=utf-8;' }), this.content.filename + '.json'
      );
    } else {
      // Save post for publishing
      this.content.filename = this.parseFilename();

      if (!this.content.timestamp) {
        this.content.timestamp = Math.round((new Date()).getTime() / 1000).toString();
      } else {
        this.content.editedTimestamp = Math.round((new Date()).getTime() / 1000).toString();
      }

      saveAs(new Blob(
        [JSON.stringify(this.content, null, 2)], { type: 'text/plain;charset=utf-8;' }), this.content.filename + '.json'
      );

      // Save archive but first check if the post exists, if so, don't save the archive
      const that = this;
      if (!this.archives.some((post => post.postTitle === that.content.postTitle))) {
        this.archives.unshift({
          postTitle: this.content.postTitle,
          timestamp: Math.round((new Date()).getTime() / 1000).toString(),
          filename: this.parseFilename()
        });

        saveAs(new Blob([JSON.stringify(this.archives, null, 2)], { type: 'text/plain;charset=utf-8;' }), 'archive.json');

        this.entryExists = false;
      } else {
        this.entryExists = true;
      }

      // Reload archive
      this.loadArchive();
    }
  }

  searchArhive(arg, clear?) {
    if (!!arg) {
      this.filteredArchives = this.archives.filter(entry => entry.postTitle.toLowerCase().includes(arg.toLowerCase()));
    } else {
      this.filteredArchives = this.archives;
    }

    if (clear) {
      (document.getElementById('search') as HTMLInputElement).value = '';
    }
  }

  loadFromFile(fromFile) {
    const that = this;
    const file = fromFile.target.files[0];
    const reader = new FileReader();
    let error = false;

    if (!file) {
      return;
    }

    reader.onload = (event => {
      const contents = (event.target as FileReader).result;

      // I know this is crazy but it works.
      try {
        if (Object.keys(JSON.parse(contents.toString())).toString() === Object.keys(that.content).toString()) {
          that.content = JSON.parse(contents.toString());
        } else {
          alert('Invalid file! Are you sure it\'s an Dumblog compatible JSON?');
          error = true;
          return;
        }
      } catch (e) {
        alert('Invalid file! Are you sure it\'s an Dumblog compatible JSON?');
        error = true;
        return;
      }

      document.getElementById('dismiss').click();
      (document.getElementById('file-input') as HTMLInputElement).value = '';
    });

    if (!error) {
      reader.readAsText(file);
    }
  }

  resetEditor() {
    this.content = new PostModel();
    this.content.postTitle = '';
    this.content.postContent = 'A new post.';
  }

  parseFilename() {
    let filename = this.content.postTitle;

    filename = filename.replace(/[^a-zA-Z0-9_]+/gi, '-').toLowerCase();

    while (filename.endsWith('-')) {
      filename = filename.slice(0, -1);
    }

    if (filename.length > 50) { // Limit filename size
      filename = filename.substring(0, 50);

      if (filename.includes('-')) {
        filename = filename.substr(0, Math.min(filename.length, filename.lastIndexOf('-'))); // Re-trim to avoid cutting a word in half.
      }
    }

    return filename;
  }

  parseTimestamp(timestamp) {
    return new Date(timestamp * 1000).toUTCString();
  }

  getJSON(arg): Observable<any> {
    return this.http.get('./assets/posts/' + arg + '.json');
  }

  editorReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
}
