import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private apiUrl = 'https://development.api.optio.ai/api/v2/banners/find';
  private authToken =
    'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImludGVybnNoaXBAb3B0aW8uYWkiLCJzdWIiOiJpbnRlcm5zaGlwIiwiaW50ZXJuc2hpcElkIjoib3RjaG9raG9uZWxpZHplNEBnbWFpbC5jb20iLCJpYXQiOjE2OTY1Njg5MjcsImV4cCI6MTY5NzQzMjkyN30.y1JIrlwozUMnOKFcLjmDmvuA1NFml2XQXQpQahzY5GdH6XuOywEuaCW9UZZzG0HVyIVoBhbESXcDoNj3aJXPIw';

  constructor(private http: HttpClient) {}

  getBanners(
    pageIndex: number,
    sortBy: string,
    sortDirection: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
    });

    return this.http
      .post(
        this.apiUrl,
        {
          pageSize: 10,
          pageIndex,
          sortBy,
          sortDirection,
        },
        { headers }
      )
      .pipe(map((response: any) => response.data));
  }
}
