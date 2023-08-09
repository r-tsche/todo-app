import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/services/snackbar/snackbar.service';
import { TodoService } from 'src/app/services/todo/todo.service';
import { RequestState } from 'src/app/shared/enum/request-state.enum';
import { TodoItem } from 'src/app/shared/model/todo-item.model';

@Component({
  selector: 'app-add-new-item',
  templateUrl: './add-new-item.component.html',
  styleUrls: ['./add-new-item.component.scss'],
})
export class AddNewItemComponent implements OnInit {
  public form: FormGroup;
  requestState = RequestState.NOT_STARTED;
  minDate: Date;

  constructor(
    private todoService: TodoService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddNewItemComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { itemId: string },
    private snackbar: SnackBarService
  ) {}

  public get RequestState(): typeof RequestState {
    return RequestState;
  }

  ngOnInit(): void {
    this.minDate = new Date();
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      deadline: ['', Validators.required],
      description: [''],
    });
  }

  addNewItem(): void {
    this.requestState = RequestState.LOADING;
    const item: TodoItem = {
      id: String(Date.now()),
      title: this.form.get('title')?.value,
      deadline: this.form.get('deadline')?.value,
      completed: false,
      description: this.form.get('description')?.value,
    };

    if (this.data.itemId) {
      this.todoService.addTodoItem(this.data.itemId, item).subscribe({
        next: () => {
          this.dialogRef.close(item);
        },
        error: () => {
          this.snackbar.openSnackBar('An error occured while adding item');
          this.dialogRef.close(null);
        },
      });
    }
  }
}
