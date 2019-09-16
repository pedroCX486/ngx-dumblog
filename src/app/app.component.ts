import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  blogTitle;
  about;

  constructor(private http: HttpClient, private titleService: Title, private router: Router) {
    this.getJSON().subscribe(data => {
      this.blogTitle = data.blogtitle;
      this.titleService.setTitle(this.blogTitle);

      this.about = data.about;
    });
  }

  ngOnInit(){
    this.router.navigate(['/blog'], { skipLocationChange: true });
  }

  getJSON(): Observable<any> {
    return this.http.get("./assets/configs.json");
  }

}
