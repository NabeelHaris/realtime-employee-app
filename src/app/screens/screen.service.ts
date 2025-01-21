import { Injectable } from '@angular/core';
import * as localforage from 'localforage';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  constructor() {}

  async saveEmployeeDetailsInDB(id: string, formData: Employee): Promise<void> {
    const dataWithId = { id, ...formData };
    await localforage.setItem(id, dataWithId);
  }

  async getEmployeeList(): Promise<Employee[]> {
    const keys = await localforage.keys();
    const allEmployees: Employee[] = [];

    for (const key of keys) {
      const data = await localforage.getItem<Employee>(key);
      if (data) {
        allEmployees.push(data);
      }
    }

    return allEmployees;
  }
  async getEmployeeById(id: string): Promise<any | null> {
    const employee = await localforage.getItem(id);
    console.log('employee:', employee);

    return employee;
  }
  async editEmployee(id: string, updatedData: Employee): Promise<boolean> {
    const existingEmployee = await localforage.getItem(id);

    if (existingEmployee) {
      const updatedEmployee = { ...existingEmployee, ...updatedData };
      await localforage.setItem(id, updatedEmployee);
      return true;
    } else {
      console.error(`Employee with ID ${id} not found`);
      return false;
    }
  }
  // Delete employee from IndexedDB
  async onDelete(id: string): Promise<any> {
    try {
      let data = await localforage.removeItem(id);
      console.log(`Employee with ID ${id} deleted successfully.`);
      // Refresh table
      return true;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return error
    }
  }
}
