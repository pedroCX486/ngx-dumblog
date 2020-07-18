import { Component, OnInit } from '@angular/core';
import { ArchiveModel } from '@shared/models/archive.model';
import { HelperService } from '@shared/services/helper.service';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.scss']
})
export class ArchivesComponent implements OnInit {

  urlParams = new URLSearchParams(window.location.search);
  archives: ArchiveModel[] = [];
  filteredArchives: ArchiveModel[] = [];

  constructor(private helperService: HelperService) { }

  ngOnInit(): void {
    this.loadArchive();
  }

  loadArchive(): void {
    this.helperService.getJSON('./assets/posts/archive.json').subscribe(data => {
      this.archives = data;
      this.filteredArchives = data;
    });
  }

  parseTimestamp(timestamp: string): string {
    return !!timestamp ? '(' + this.helperService.parseTimestamp(timestamp) + ')' : '';
  }

  searchArhive(arg: string, clear?: boolean): void {
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
