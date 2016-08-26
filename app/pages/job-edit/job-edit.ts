import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import {JobService} from '../../providers/job-service/job-service';
import {Job} from '../../model/Job';

@Component({
  templateUrl: 'build/pages/job-edit/job-edit.html',
  providers :[JobService]
})
export class JobEditPage {

	public todo: Job;    // The todo itself
  	public todos: Job[]; // The list of todos from the main page
  	public index: number; // The index of the todo we're looking at


  constructor(private navCtrl: NavController, private navParams : NavParams, private _jobService : JobService) {
  		 this.todo = navParams.get('todo');
    	this.todos = navParams.get('todos');
    	this.index = navParams.get('index');
  }

  saveTodo(updatedDescription: string) {
    this.todo.manager = updatedDescription;
    this._jobService.update(this.todo)
        .subscribe(response => {
          this.navCtrl.pop(); // go back to todo list
        });
  }

  deleteTodo() {
    this._jobService.delete(this.todo)
      .subscribe(response => {
        this.todos.splice(this.index, 1); // remove the todo
        this.navCtrl.pop(); //go back to todo list
      });
  }

}
