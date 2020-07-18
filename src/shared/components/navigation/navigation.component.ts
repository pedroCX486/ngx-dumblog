import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';
import { SettingsModel } from '@shared/models/settings.model';
import { HelperService } from '@shared/services/helper.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  isProduction = environment.production;
  settings: SettingsModel;

  constructor(private helperService: HelperService, private titleService: Title) { }

  ngOnInit(): void {
    this.helperService.getSettings().toPromise()
      .then((data: SettingsModel) => this.settings = data)
      .then(() => this.titleService.setTitle(this.settings.blogTitle));
  }
}
