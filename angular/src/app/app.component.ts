import { Component } from '@angular/core';
import { NotificationService } from './shared/services/notification.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private notificationService: NotificationService,
    public snackBar: MatSnackBar
   ) {
    this.notificationService.subj_notification.subscribe(message => {
      this.snackBar.open(message);
    });

   }
}
