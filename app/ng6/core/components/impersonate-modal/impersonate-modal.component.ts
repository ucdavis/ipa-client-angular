import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// Modal Dialog Component
@Component({
  selector: 'impersonate-modal',
  templateUrl: 'impersonate-modal.component.html'
})
export class ImpersonateModal {
  constructor(
    public dialogRef: MatDialogRef<ImpersonateModal>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onClick(userToImpersonate): void {
    this.dialogRef.close(userToImpersonate); // optional result to return to dialog opener
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
