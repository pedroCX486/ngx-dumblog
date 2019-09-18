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

  urlParams = new URLSearchParams(window.location.search);

  constructor(private http: HttpClient, private titleService: Title, private router: Router) {
    this.getJSON().subscribe(data => {
      this.blogTitle = data.blogtitle;
      this.titleService.setTitle(this.blogTitle);

      this.about = data.about;
    });
  }

  navigate(arg){
    this.router.navigate([arg], { skipLocationChange: true });
  }

  ngOnInit(){
    if(this.urlParams.get('post')){
      this.router.navigate(['/blog/posts'], {queryParams: { post: this.urlParams.get('post')}, skipLocationChange: true });
    }else{
      switch (this.urlParams.get('page')){
        case 'editor':
          this.router.navigate(['/editor'], { skipLocationChange: true });
        break;
        case 'archives':
          this.router.navigate(['/blog/archives'], { skipLocationChange: true });
        break;
        default:
          this.router.navigate(['/blog'], { skipLocationChange: true });
        break;
      }
    }
  }

  getJSON(): Observable<any> {
    return this.http.get("./assets/configs.json");
  }

}
