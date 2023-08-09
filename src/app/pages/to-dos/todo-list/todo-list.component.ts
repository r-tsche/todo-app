import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { TodoService } from 'src/app/services/todo/todo.service';
import { TodoList } from 'src/app/shared/model/todo-list.model';
import { AddNewListComponent } from './add-new-list/add-new-list.component';
import { SnackBarService } from 'src/app/services/snackbar/snackbar.service';
import { RequestState } from 'src/app/shared/enum/request-state.enum';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  todoLists: TodoList[];
  requestState = RequestState.NOT_STARTED;

  constructor(
    private todoService: TodoService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackBarService
  ) {}

  public get RequestState(): typeof RequestState {
    return RequestState;
  }

  ngOnInit(): void {
    this.loadLists();
  }

  openList(id: string): void {
    this.router.navigate(['to-do-list/' + id]);
  }

  addNewList(): void {
    const dialogRef = this.dialog.open(AddNewListComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.todoLists.push(result);
      }
    });
  }

  private loadLists() {
    this.requestState = RequestState.LOADING;
    this.todoService.getAllLists().subscribe({
      next: (res: TodoList[]) => {
        this.todoLists = res;
        this.requestState = RequestState.SUCCESS;
      },
      error: () => {
        this.snackbar.openSnackBar('An error occured while getting lists');
        this.requestState = RequestState.ERROR;
      },
    });
  }
}
