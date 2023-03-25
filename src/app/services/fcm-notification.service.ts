import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FcmNotificationService {

  constructor(private http: HttpClient) { }

  headers= new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Authorization', 'key=AAAAJe_QmpQ:APA91bFuh9YO-N2djp2oq-hyCIDn5EGcfqfPxuGqC_cphKh6A7xpOrWPLSU8a3XX5F7xThg80OS5pgkrpVFVXgjyDYz-cIXjdNkO8SgB6b_m1W5aThq57GjTOgBI_GgrwHq-o4BRQCty');

  sendPostRequest(data: any): Observable<any> {
    return this.http.post<any>("https://fcm.googleapis.com/fcm/send", data, { 'headers': this.headers });
}
}
