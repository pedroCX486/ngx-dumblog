import { Component, OnInit } from '@angular/core';
import { IArchive } from '@shared/interfaces/archive.interface';
import { HelperService } from '@shared/services/helper.service';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.scss']
})
export class ArchivesComponent implements OnInit {

  urlParams = new URLSearchParams(window.location.search);
  archives: IArchive[] = [];
  filteredArchives: IArchive[] = [];

  constructor(private helperService: HelperService) { }

  ngOnInit(): void {
    this.loadArchive();
  }

  loadArchive(): void {
    this.helperService.getArchive().subscribe(data => {
      this.archives = data;
      this.filteredArchives = data;
    });
  }

  parseTimestamp(timestamp: string): string {
    return !!timestamp ? '(' + this.helperService.parseTimestamp(timestamp) + ')' : '';
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
}
