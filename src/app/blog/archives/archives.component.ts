import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.scss']
})
export class ArchivesComponent implements OnInit {

  archives = [];
  urlParams = new URLSearchParams(window.location.search);

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.loadArchive();
  }

  getJSON(arg): Observable<any> {
    return this.http.get("./assets/posts/"+ arg +".json");
  }

  loadArchive(){
    this.getJSON('archive').subscribe(data => {
      this.archives = data;
    });
  }
}
