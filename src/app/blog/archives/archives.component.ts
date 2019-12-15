import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ArchiveModel } from 'src/app/models/archive.model';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.scss']
})
export class ArchivesComponent implements OnInit {

  urlParams = new URLSearchParams(window.location.search);
  archives: ArchiveModel[] = [];
  filteredArchives: ArchiveModel[] = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loadArchive();
  }

  getJSON(arg): Observable<any> {
    return this.http.get('./assets/posts/' + arg + '.json');
  }

  loadArchive() {
    this.getJSON('archive').subscribe(data => {
      this.archives = data;
      this.filteredArchives = data;
    });
  }

  parseTimestamp(timestamp) {
    if (!!timestamp) {
      return '(' + new Date(timestamp * 1000).toUTCString() + ')';
    } else {
      return '';
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
}
