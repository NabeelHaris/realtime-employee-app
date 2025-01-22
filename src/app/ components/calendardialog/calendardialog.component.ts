import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-calendardialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './calendardialog.component.html',
  styleUrls: ['./calendardialog.component.scss'],
})
export class CalendardialogComponent {
  selectedDate: Date | null = null; // Allow null as a value
  selectedAction: string | null = 'today';

  constructor(
    public dialogRef: MatDialogRef<CalendardialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date }
  ) {
    if (this.data && this.data.date) {
      this.selectedDate = this.data.date; 
    }
  }

  // setSelected(action: string): void {
  //   this.selectedAction = action;
  //   switch (action) {
  //     case 'today':
  //       this.selectToday();
  //       break;
  //     case 'nextMonday':
  //       this.selectNextMonday();
  //       break;
  //     case 'nextTuesday':
  //       this.selectNextTuesday();
  //       break;
  //     case 'oneWeekLater':
  //       this.selectOneWeekLater();
  //       break;
  //   }
  // }

  // selectToday(): void {
  //   this.selectedDate = new Date(); // Assign today's date
  // }

  // selectNextMonday(): void {
  //   const today = new Date();
  //   const nextMonday = new Date(today);
  //   nextMonday.setDate(today.getDate() + ((8 - today.getDay()) % 7 || 7));
  //   this.selectedDate = nextMonday;
  // }

  // selectNextTuesday(): void {
  //   const today = new Date();
  //   const nextTuesday = new Date(today);
  //   nextTuesday.setDate(today.getDate() + ((9 - today.getDay()) % 7 || 7));
  //   this.selectedDate = nextTuesday;
  // }

  // selectOneWeekLater(): void {
  //   const today = new Date();
  //   const oneWeekLater = new Date(today);
  //   oneWeekLater.setDate(today.getDate() + 7);
  //   this.selectedDate = oneWeekLater;
  // }
  setSelected(action: string): void {
    this.selectedAction = action;
    switch (action) {
      case 'today':
        this.selectToday();
        break;
      case 'nextMonday':
        this.selectNextMonday();
        break;
      case 'nextTuesday':
        this.selectNextTuesday();
        break;
      case 'oneWeekLater':
        this.selectOneWeekLater();
        break;
    }
  }
  
  selectToday(): void {
    this.selectedDate = new Date(); 
  }
  
  selectNextMonday(): void {
    const today = this.selectedDate || new Date(); 
    const nextMonday = this.getNextWeekday(today, 1);
    this.selectedDate = nextMonday;
  }
  
  selectNextTuesday(): void {
    const today = this.selectedDate || new Date(); 
    const nextTuesday = this.getNextWeekday(today, 2); 
    this.selectedDate = nextTuesday;
  }
  
  selectOneWeekLater(): void {
    const today = this.selectedDate || new Date();
    const oneWeekLater = this.addDays(today, 7); 
    this.selectedDate = oneWeekLater;
  }
  
  getNextWeekday(startDate: Date, weekday: number): Date {
    const resultDate = new Date(startDate);
    let daysToAdd = (7 + weekday - resultDate.getDay()) % 7;
    
    // If it's already the target weekday, go to the next one
    if (daysToAdd === 0) {
      daysToAdd = 7;
    }
    return this.addDays(resultDate, daysToAdd);
  }
  
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days); // Automatically handles month and year transitions
    return result;
  }
  

  save(): void {
    console.log('Saved:', this.selectedDate);
    this.dialogRef.close(this.selectedDate);
  }

  cancel(): void {
    this.selectedAction = null;
    this.selectedDate = null; // Allow resetting to null
    this.dialogRef.close(null);
  }
}
