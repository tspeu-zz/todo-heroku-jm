import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {Job} from '../../model/Job';


@Injectable()
export class JobService {
  
   _Job_Url = "/api/jobs";

  constructor(private _http: Http) {}

  // Get all todos
  load(): Observable<Job[]> {
    return this._http.get(this._Job_Url)
    .map(res => res.json())
    .catch(this.handleError);
  }

   // Add a todo-edit
  add(todo: string): Observable<Job> {
    let body = JSON.stringify({description: todo});
    let headers = new Headers({'Content-Type': 'application/json'});

    return this._http.post(this._Job_Url, body, {headers: headers})
                    .map(res => res.json())
                    .catch(this.handleError);
  }

  // Update a todo
  update(job: Job) {
    let url = `${this._Job_Url}/${job._id}`; //see mdn.io/templateliterals
    let body = JSON.stringify(job)
    let headers = new Headers({'Content-Type': 'application/json'});

    return this._http.put(url, body, {headers: headers})
                    .map(() => job) //See mdn.io/arrowfunctions
                    .catch(this.handleError);
  }
  // Delete a todo
  delete(job: Job) {
    let url = `${this._Job_Url}/${job._id}`;
    let headers = new Headers({'Content-Type': 'application/json'});

    return this._http.delete(url, headers)
               .catch(this.handleError);
  }

  handleError(error) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

}

