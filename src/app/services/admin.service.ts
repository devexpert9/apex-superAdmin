import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})
export class AdminService {
  constructor( private httpClient: HttpClient) { }

  // postData(link, formdata):Observable<EventData[]>{
  //   return this.http.post<EventData[]>('http://18.217.224.73:3000/' + link, formdata);
  // }

  public postData(link, formdata)
  {
    return this.httpClient.post('http://18.217.224.73:3000/'+link, formdata);
  }
}