import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { ISettings } from '@shared/interfaces/settings.interface';
import { HelperService } from '@shared/services/helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  isProduction = environment.production;
  settings!: ISettings;

  constructor(private helperService: HelperService, private titleService: Title, private router: Router) { }

  ngOnInit(): void {
    this.helperService.getSettings().subscribe({
      next: (data: ISettings) => {
        this.settings = data;
      },
      complete: () => {
        this.titleService.setTitle(this.settings.blogTitle);
      }
    });
  }

  isCurrentPage(url: string): boolean {
    return this.router.url === url;
  }
}
