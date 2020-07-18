import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HelperService {
  constructor(private httpClient: HttpClient) { }

  getSettings(): Observable<any> {
    return this.httpClient.get('./assets/settings.json');
  }

  getJSON(arg: string): Observable<any> {
    return this.httpClient.get(arg);
  }

  generateTimestamp(): string {
    return Math.round((new Date()).getTime() / 1000).toString();
  }

  parseTimestamp(timestamp: string): string {
    return new Date(Number(timestamp) * 1000).toUTCString();
  }
}
