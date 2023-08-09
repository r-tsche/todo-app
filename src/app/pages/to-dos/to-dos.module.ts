import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { PathName } from 'src/app/shared/enum/path-name.enum';
import { FilterItemPipe } from 'src/app/pipes/filterItem.pipe';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';
import { FilterStatePipe } from 'src/app/pipes/filterState.pipe';
import { AddNewListComponent } from './todo-list/add-new-list/add-new-list.component';
import { AddNewItemComponent } from './todo-item/add-new-item/add-new-item.component';
import { DeleteDialogComponent } from './todo-item/delete-dialog/delete-dialog.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: PathName.TODOLIST,
    pathMatch: 'full',
  },
  {
    path: PathName.TODOLIST,
    component: TodoListComponent,
  },
  {
    path: PathName.TODOITEM,
    component: TodoItemComponent,
  },
];

@NgModule({
  declarations: [
    TodoListComponent,
    TodoItemComponent,
    FilterItemPipe,
    TruncatePipe,
    FilterStatePipe,
    AddNewListComponent,
    AddNewItemComponent,
    DeleteDialogComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
  ],
})
export class ToDosModule {}
