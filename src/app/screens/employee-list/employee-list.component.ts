import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ScreenService } from '../screen.service';
import { Employee } from 'src/app/interfaces/employee';
import {MatButtonModule} from '@angular/material/button';
import * as localforage from 'localforage';
import { MatTableModule } from '@angular/material/table';
import { HeaderComponent } from 'src/app/ components/header/header.component';
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    HeaderComponent
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  employeeList: Employee[] = [];
  displayedColumns: string[] = [
    'id',
    'employeeName',
    'role',
    'startDate',
    'endDate',
    'actions',
  ]; // Define table columns
  constructor(private screenService: ScreenService) {}
  ngOnInit(): void {
    this.getEmployeeList();
  }

  getEmployeeList() {
    try {
      this.screenService
        .getEmployeeList()
        .then((res) => {
          console.log('employee-list:', res);
          if (res.length) {
            this.employeeList = res;
          }
        })
        .catch((error) => {
          console.log('employee-list-error:', error);
        });
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }

  // Delete employee from IndexedDB
  onDelete(id: any, index: number) {
    try {
      this.screenService.onDelete(id).then(res => {
        console.log("delete-res:", res);
        if (res) {
          this.employeeList.splice(index, 1)
        }
      }).catch(error => {

      });
      // this.loadEmployeeList(); // Refresh table
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }
}
