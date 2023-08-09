import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/services/snackbar/snackbar.service';
import { TodoService } from 'src/app/services/todo/todo.service';
import { RequestState } from 'src/app/shared/enum/request-state.enum';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent {
  requestState = RequestState.NOT_STARTED;

  constructor(
    private todoService: TodoService,
    private dialogRef: MatDialogRef<DeleteDialogComponent>,
    private snackbar: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: { itemId?: string; listId: string }
  ) {}

  public get RequestState(): typeof RequestState {
    return RequestState;
  }

  onDelete(): void {
    this.requestState = RequestState.LOADING;
    if (this.data.itemId) {
      this.todoService
        .deleteTodoItem(this.data.listId, this.data.itemId)
        .subscribe({
          next: () => {
            this.dialogRef.close('success');
          },
          error: () => {
            this.snackbar.openSnackBar('An error occured while deleting item');
            this.dialogRef.close(null);
          },
        });
    } else {
      this.todoService.deleteTodoList(this.data.listId).subscribe({
        next: () => {
          this.dialogRef.close('success');
        },
        error: () => {
          this.snackbar.openSnackBar('An error occured while deleting list');
          this.dialogRef.close(null);
        },
      });
    }
  }
}
