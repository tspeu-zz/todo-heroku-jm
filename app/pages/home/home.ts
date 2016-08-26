import { Component , OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import {JobService} from '../../providers/job-service/job-service';
import {Job} from '../../model/Job';
import {JobEditPage} from '../job-edit/job-edit';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers :[JobService]
})
export class HomePage implements OnInit{
  
 public job: Job[];

  constructor(private navCtrl: NavController, private _jobService : JobService) {

  }

  ngOnInit(){
  	this.loadJobs();
  }

  loadJobs() {
    this._jobService.load()
      .subscribe(data => {this.job = data;})
  }

  addTodo(todo:string) {

    
    this._jobService.add(todo)
        .subscribe(data  => {
          this.job.push(data)
        });
  }
/*Our second method will receive an actual Todo object from the view. 
The first step is to set the isComplete property of our Todo equal to its opposite 
(i.e., true becomes false or vice versa). Then we ask our TodoService to update that particular Todo. 
Because we toggled a property of a Todo object already in our HomePage component, 
the view has already been updated.*/
  toggleComplete(todo: Job) {
    todo.isComplete = !todo.isComplete;
    this._jobService.update(todo)
        .subscribe(data => {
          todo = data;
        })
  }

  deleteTodo(todo: Job, index:number) {
    this._jobService.delete(todo)
        .subscribe(response => {
          this.job.splice(index, 1);
        });
  }


   navToEdit(todo: Job, index: number) {
    this.navCtrl.push(JobEditPage, {
      todo: todo,
      todos: this.job,
      index: index
    });
  }

}
