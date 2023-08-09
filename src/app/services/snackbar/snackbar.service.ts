import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  public openSnackBar(message: string) {
    this.snackBar.open(message, 'Ok', {
      duration: 4000,
    });
  }
}
