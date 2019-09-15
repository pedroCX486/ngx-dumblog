import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  blogTitle;
  about;

  constructor(private http: HttpClient, private titleService: Title) {
    this.getJSON().subscribe(data => {
      this.blogTitle = data.blogtitle;
      this.titleService.setTitle(this.blogTitle);

      this.about = data.about;
    });
  }

  getJSON(): Observable<any> {
    return this.http.get("./assets/configs.json");
  }

}
