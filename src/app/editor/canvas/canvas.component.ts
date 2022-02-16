import { Component, OnInit } from '@angular/core';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { saveAs } from 'file-saver';
import { IPost } from '@shared/interfaces/post.interface';
import { HelperService } from '@shared/services/helper.service';
import { IArchive } from '@shared/interfaces/archive.interface';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  Editor = DecoupledEditor;
  editorConfig = { placeholder: 'Your text' };
  content!: IPost;

  archives: IArchive[] = [];
  filteredArchives: IArchive[] = [];
  entryExists = false;

  constructor(public helperService: HelperService) {
    this.resetEditor();
  }

  ngOnInit(): void {
    this.loadArchive();
  }

  loadArchive(): void {
    this.helperService.getArchive().subscribe(data => {
      this.archives = data;
      this.filteredArchives = data;
    });
  }

  loadPost(filename: string): void {
    this.helperService.getPost(filename).subscribe({
      next: data => {
        this.content = data;
      },
      error: error => {
        alert('Error loading post!\nAre you connected to the internet?');
      }
    });
  }

  savePost(isDraft: boolean): void {
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
        this.content.timestamp = this.helperService.generateTimestamp();
      } else {
        this.content.editedTimestamp = this.helperService.generateTimestamp();
      }

      saveAs(new Blob(
        [JSON.stringify(this.content, null, 2)], { type: 'text/plain;charset=utf-8;' }), this.content.filename + '.json'
      );

      // Save archive but first check if the post exists, if so, don't save the archive
      const that = this;
      if (!this.archives.some((post => post.postTitle === that.content.postTitle))) {
        this.archives.unshift({
          postTitle: this.content.postTitle,
          timestamp: this.helperService.generateTimestamp(),
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

  searchArhive(eventTarget: any, clear?: boolean): void {
    if (!!eventTarget) {
      this.filteredArchives = this.archives.filter(entry => entry.postTitle.toLowerCase().includes(eventTarget.value.toLowerCase()));
    } else {
      this.filteredArchives = this.archives;
    }

    if (clear) {
      (document.getElementById('search') as HTMLInputElement).value = '';
    }
  }

  loadFromFile(fromFile: any): void {
    const that = this;
    const file = fromFile.target.files[0];
    const reader = new FileReader();
    let error = false;

    if (!file) {
      return;
    }

    reader.onload = (event => {
      const contents: any = (event.target as FileReader).result;

      // I know this is crazy but it works.
      try {
        if (Object.keys(JSON.parse(contents.toString())).toString() === Object.keys(that.content).toString()) {
          that.content = JSON.parse(contents.toString());
        } else {
          alert('Invalid file! Are you sure it\'s an Dumblog compatible JSON?');
          error = true;
        }
      } catch (e) {
        alert('Error loading file! Check the console for more info.');
        console.log(e);
        error = true;
      }

      (document.getElementById('dismiss') as HTMLElement).click();
      (document.getElementById('file-input') as HTMLInputElement).value = '';
    });

    if (!error) {
      reader.readAsText(file);
    }
  }

  resetEditor(): void {
    this.content = <IPost>{};
    this.content.postTitle = '';
    this.content.postContent = '';
  }

  parseFilename(): string {
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

  editorReady(editor: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
}
