import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TodoService } from 'src/app/services/todo/todo.service';
import { PathName } from 'src/app/shared/enum/path-name.enum';
import { ItemResponse } from 'src/app/shared/model/itemResponse.mode';
import { TodoItem } from 'src/app/shared/model/todo-item.model';
import { AddNewItemComponent } from './add-new-item/add-new-item.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { SnackBarService } from 'src/app/services/snackbar/snackbar.service';
import { RequestState } from 'src/app/shared/enum/request-state.enum';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: SnackBarService
  ) {}

  todoItems: TodoItem[];
  title: string;
  itemId: string | null;
  filterBy: string;
  itemState = [
    { value: 'all', viewValue: 'All' },
    { value: 'active', viewValue: 'Active' },
    { value: 'completed', viewValue: 'Completed' },
  ];
  currentItemState = 'all';
  requestState = RequestState.NOT_STARTED;

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('itemId');

    this.getItem();
  }

  public get RequestState(): typeof RequestState {
    return RequestState;
  }

  isPastDeadline(date: string): boolean {
    const now = new Date().getTime();
    if (now > new Date(date).getTime()) {
      return true;
    }
    return false;
  }

  addNewItem(): void {
    const dialogRef = this.dialog.open(AddNewItemComponent, {
      data: {
        itemId: this.itemId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.todoItems.push(result);
      }
    });
  }

  changeStatus(checked: boolean, item: TodoItem): void {
    item.completed = checked;
    if (this.itemId) {
      this.todoService.updateTodoItem(this.itemId, item).subscribe({
        next: () => {},
        error: () => {
          item.completed = !checked;
          this.snackbar.openSnackBar(
            'An error occured while changing item state'
          );
        },
      });
    }
  }

  deleteItem(id: string): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        itemId: id,
        listId: this.itemId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const itemIndex = this.todoItems.findIndex((item) => item.id === id);
        this.todoItems.splice(itemIndex, 1);
      }
    });
  }

  deleteList(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        listId: this.itemId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate([PathName.TODOLIST]);
      }
    });
  }

  private getItem() {
    this.requestState = RequestState.LOADING;
    if (this.itemId) {
      this.todoService.getTodoItems(this.itemId).subscribe({
        next: (res: ItemResponse) => {
          this.title = res.title;
          this.todoItems = res.items;
          this.requestState = RequestState.SUCCESS;
        },
        error: () => {
          this.snackbar.openSnackBar('Unable to get item');
          this.router.navigate([PathName.ROOT]);
        },
      });
    }
  }
}
