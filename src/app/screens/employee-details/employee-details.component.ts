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

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
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
    MatSnackBarModule
  ],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss'],
})
export class EmployeeDetailsComponent {
  employeeForm!: FormGroup;
  roles: string[] = ['Manager', 'Developer', 'Designer', 'Tester'];
  isEditMode = false;
  employeeId: any;

  constructor(
    private fb: FormBuilder,
    private screenService: ScreenService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
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
      }
    });
  }

  private getEmployeeById() {
    try {
      this.screenService
        .getEmployeeById(this.employeeId)
        .then((res) => {
          if (res) {
            this.employeeForm.patchValue(res);
          }
        })
        .catch((error) => {
          console.log('error:', error);
        });
    } catch (error) {}
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
