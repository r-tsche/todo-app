import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/services/snackbar/snackbar.service';
import { TodoService } from 'src/app/services/todo/todo.service';
import { RequestState } from 'src/app/shared/enum/request-state.enum';
import { TodoList } from 'src/app/shared/model/todo-list.model';

@Component({
  selector: 'app-add-new-list',
  templateUrl: './add-new-list.component.html',
  styleUrls: ['./add-new-list.component.scss'],
})
export class AddNewListComponent implements OnInit {
  public form: FormGroup;
  requestState = RequestState.NOT_STARTED;

  constructor(
    private todoService: TodoService,
    private formBuilder: FormBuilder,
    private snackbar: SnackBarService,
    private dialogRef: MatDialogRef<AddNewListComponent>
  ) {}

  public get RequestState(): typeof RequestState {
    return RequestState;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
    });
  }

  addNewList(): void {
    this.requestState = RequestState.LOADING;

    const list: TodoList = {
      title: this.form.get('title')?.value,
      id: String(Date.now()), // Assign a unique ID to the new item
      items: [],
    };
    this.todoService.addTodoList(list).subscribe({
      next: () => {
        this.dialogRef.close(list);
      },
      error: () => {
        this.snackbar.openSnackBar('An error occured while adding new list');
        this.dialogRef.close(null);
      },
    });
  }
}
