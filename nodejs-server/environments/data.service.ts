import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private serverUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  saveData(data: any) {
    const url = `${this.serverUrl}/save-data`;
    return this.http.post(url, data);
  }

  savePhotoToServer(photoData: string) {
    const url = `${this.serverUrl}/save-photo`; // Serverdaki uygun URL
    const body = { photoData }; // Gönderilecek veri oluşturuluyor
    return this.http.post(url, body);
  }
  
 
}
