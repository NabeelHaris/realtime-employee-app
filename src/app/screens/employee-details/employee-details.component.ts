import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ScreenService } from '../screen.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/interfaces/employee';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { HeaderComponent } from 'src/app/ components/header/header.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { CalendardialogComponent } from 'src/app/ components/calendardialog/calendardialog.component';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent {
  employeeForm!: FormGroup;
  roles: string[] = ['Manager', 'Developer', 'Designer', 'Tester'];
  isEditMode = false;
  employeeId: any;
  headerText = 'Add Employee Details';
  selectedDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private fb: FormBuilder,
    private screenService: ScreenService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      employeeName: ['', Validators.required],
      role: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
    this.route.paramMap.subscribe((params) => {
      this.employeeId = params.get('id');
      if (this.employeeId) {
        this.getEmployeeById();
        this.isEditMode = true; // If `id` exists, it's edit mode
        this.headerText = 'Edit Employee Details';
      }
    });
  }

  private getEmployeeById() { 
    try {
      this.screenService
        .getEmployeeById(this.employeeId)
        .then((res) => {
          console.log("res:", res);
          
          if (res) {
            this.employeeForm.patchValue(res);
            this.selectedDate = res.startDate;
            this.endDate = res.endDate;
          }
        })
        .catch((error) => {
          console.log('error:', error);
        });
    } catch (error) {}
  }

  openCalendar(type: 'start' | 'end') {
    const dialogRef = this.dialog.open(CalendardialogComponent, {
      width: '400px',
      data: { date: type === 'start' ? this.selectedDate : this.endDate },
    });

    dialogRef.afterClosed().subscribe((result: Date | null) => {
      if (result) {
        if (type === 'start') {
          this.selectedDate = result;
          this.employeeForm.get('startDate')?.setValue(result);
        } else {
          this.endDate = result;
          this.employeeForm.get('endDate')?.setValue(result);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;

      try {
        // Save the data to IndexedDB using localForage
        if (this.isEditMode) {
          this.editEmployeeDetails(formData);
        } else {
          this.saveEmployeeDetails(formData);
        }

        // Optionally clear the form
        this.employeeForm.reset();
      } catch (error) {
        console.error('Error saving data:', error);
      }
    } else {
      console.error('Form is invalid');
    }
  }

  private saveEmployeeDetails(formData: Employee) {
    const id = `${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;
    // Add the ID to the form data
    this.screenService
      .saveEmployeeDetailsInDB(id, formData)
      .then((res) => {
        console.log('db-res:', res);
        this._snackBar.open('Employee added successfully!', 'Close', {
          duration: 3000, // The snackbar will auto-close after 3 seconds
        });
      })
      .catch((error) => {
        console.log('db-error:', error);
      });
  }

  private editEmployeeDetails(formData: Employee) {
    this.screenService
      .editEmployee(this.employeeId, formData)
      .then((res) => {
        console.log('update-res:', res);
        this._snackBar.open('Employee updated successfully!', 'Close', {
          duration: 3000, // The snackbar will auto-close after 3 seconds
        });
        this.router.navigate(['/employee/list']);
      })
      .catch((error) => {
        console.log('error:', error);
      });
  }

  onCancel(): void {
    this.employeeForm.reset();
    this.router.navigate(['/employee/list']);
  }
}
