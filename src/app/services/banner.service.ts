import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetBannerRequest, BannersResponse, Banner } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private apiUrl = 'https://development.api.optio.ai/api/v2/banners';
  private blobUploadUrl = 'https://development.api.optio.ai/api/v2/blob/upload';
  private blobDownloadUrl = 'https://development.api.optio.ai/api/v2/blob'; 
  private bannerDataSubject = new BehaviorSubject<any>(null);
  bannerData$ = this.bannerDataSubject.asObservable();

  private authToken =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImludGVybnNoaXBAb3B0aW8uYWkiLCJzdWIiOiJpbnRlcm5zaGlwIiwiaW50ZXJuc2hpcElkIjoib3RjaG9raG9uZWxpZHplNEBnbWFpbC5jb20iLCJpYXQiOjE2OTc0MzAyODAsImV4cCI6MTY5ODI5NDI4MH0.g26ka0D00Y53c9tEKJPshf5gn7uXn1OAKCSkw-R7rXUF3YqTPWNWRVu-0NKyr2aEh4_T_SfcfmfkQJKnCXwfjw';

  constructor(private http: HttpClient) {}

  uploadImage(blob: File): Observable<any> {
    const formData = new FormData();
    formData.append('blob', blob);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
    });

    return this.http.post(this.blobUploadUrl, formData, { headers }).pipe(map((response: any) => response.data));
  }

  downloadBlob(blobId: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
    });

    return this.http.get(`${this.blobDownloadUrl}/${blobId}`, {
      headers,
      responseType: 'blob',
    });
  }

  setBannerData(data: any) {
    this.bannerDataSubject.next(data);
  }

  getBanners(pageIndex: number, sortBy: string, sortDirection: string, searchQuery: string): Observable<BannersResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
    });
  
    const requestData:GetBannerRequest = {
      pageSize: 10,
      pageIndex,
      sortBy,
      sortDirection,
      search: searchQuery,
    };
  
    return this.http
      .post(`${this.apiUrl}/find`, requestData, { headers })
      .pipe(map((response: any) => response.data));
  }

  saveBanner(bannerData: Banner): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
    });

    return this.http.post(`${this.apiUrl}/save`, bannerData, {
      headers,
    });
  }

  removeBanner(id: string): Observable<{ success: boolean }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
    });
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/remove`, { id }, { headers });
  }
}
