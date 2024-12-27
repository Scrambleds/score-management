import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  viewChild,
} from '@angular/core';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '../../services/search-service/seach.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AddUserService } from '../../services/add-user/add-user.service';
import { UserService } from '../../services/sharedService/userService/userService.service';
import { masterDataService } from '../../services/sharedService/masterDataService/masterDataService';
import { SelectBoxService } from '../../services/select-box/select-box.service';
import { forkJoin } from 'rxjs';
import { EditUserComponent } from '../edit-user/edit-user.component';
// import { RowNode } from 'ag-grid-community';
import { GridApi, GridOptions, RowNode } from 'ag-grid-community';

@Component({
  selector: 'app-add-user',
  standalone: false,
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  gridApi!: GridApi;
  gridColumnApi: any;
  
  // @ViewChild('onReset', { static: false }) editUserComponent!: EditUserComponent;
  @ViewChild('editUserComponent', { static: false }) editUserComponent!: EditUserComponent;
  gridOptions: GridOptions = {
    // domLayout: 'autoHeight',
    // pagination: true,
    // paginationPageSize: 10,
    // suppressRowClickSelection: true
  };  
  roleData: any[] = [];
  prefixData: any[] = [];
  statusData: any[] = [];
  // onReset!: EditUserComponent;
  @Input() criteria: any;
  @Input() titleName: string = 'อัปโหลดไฟล์ข้อมูลบัญชีผู้ใช้';
  @Input() buttonName: string = 'อัปโหลดไฟล์ Excel';

  @Output() dataUploaded = new EventEmitter<any[]>(); // ส่งข้อมูลไปยัง Parent Component
  @Output() submitRequest = new EventEmitter<void>();
  @Output() isUploaded = new EventEmitter<boolean>();
  @Output() searchEvent = new EventEmitter<void>();

  searchCriteria: any;
  rowData: any[] = [];
  columnDefs: any[] = [];
  originalData: any[] = [];
  filteredData: any[] = [];
  isFileUploaded = false;
  requiredFields = [
    'email',
    'teacher_code',
    'prefix',
    'firstname',
    'lastname',
    'role',
  ];

  defaultColDef = {
    sortable: true,
    resizable: true,
    editable: true,
  };

  form: FormGroup; // Declare form

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private searchService: SearchService,
    private addUserService: AddUserService,
    private UserService: UserService,
    private masterDataService: masterDataService,
    private SelectBoxService: SelectBoxService,
  ) {
    this.form = this.fb.group({
    });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  initGrid() {
    this.columnDefs = Object.keys(this.originalData[0]).map((key) => ({
      field: key,
      headerName: key,
      sortable: true,
      filter: true,
    }));
  }

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     if (this.gridApi) {
  //       console.log('Grid API available:', this.gridApi);
  //     } else {
  //       console.error('Grid API is not available.');
  //     }
  //   }, 0);
  // }  

  onSomeAction() {
    if (this.editUserComponent) {
      // เรียกใช้เมธอดใน EditUserComponent
      this.editUserComponent.onReset();
      console.log('Method in EditUserComponent called!');
    }
  }
  

  onLoading = (): void =>{
    this.onSomeAction()
    console.log("On change!");
  }

  ngOnInit() {

        const role = 'role';
        const prefix = 'prefix';
        const status = 'active_status';

        forkJoin({
          roleData: this.SelectBoxService.getSystemParamRole(role),
          prefixData: this.SelectBoxService.getSystemParamPrefix(prefix),
          statusData: this.SelectBoxService.getSystemParamStatus(status),
        }).subscribe({
          next: (results: any) => {
            console.log('Received role data: ', results.roleData);
            console.log('Received prefix data: ', results.prefixData);
            console.log('Received status data: ', results.statusData);
      
            // เก็บข้อมูลที่ได้รับจาก API ลงในตัวแปรที่แตกต่างกัน
            if (results.roleData && results.roleData.objectResponse) {
              this.roleData = results.roleData.objectResponse.filter(
                (item: any) => item.byte_code && item.byte_desc_th
              );
            }
      
            if (results.prefixData && results.prefixData.objectResponse) {
              this.prefixData = results.prefixData.objectResponse.filter(
                (item: any) => item.byte_code && item.byte_desc_th
              );
            }
      
            if (results.statusData && results.statusData.objectResponse) {
              this.statusData = results.statusData.objectResponse.filter(
                (item: any) => item.byte_code && item.byte_desc_en
              );
            }
      
            this.masterDataService.setMasterData(this.roleData, this.prefixData, this.statusData);
          },
          error: (err: any) => {
            console.log('Error fetching master data: ', err);
          },
        });


    this.masterDataService.getRoleDataObservable().subscribe((data) => {
      this.roleData = data;
    });

    this.masterDataService.getPrefixDataObservable().subscribe((data) => {
      this.prefixData = data;
    });

    this.searchService.currentSearchCriteria.subscribe((criteria) => {
      console.log('Updated criteria:', criteria);
      console.log('Original criteria:', this.originalData);
      if (criteria) {
        this.searchCriteria = criteria;
        this.filteredData = this.filterData(this.originalData, criteria);
        this.rowData = [...this.filteredData]; // อัปเดตข้อมูลใน ag-Grid
      }
    });
  }

  ngOnChanges(): void {
    if (this.criteria) {
      console.log('Criteria updated:', this.criteria);
      // กรองข้อมูลใหม่ทุกครั้งที่ criteria เปลี่ยน
      this.filteredData = this.filterData(this.originalData, this.criteria);
      this.rowData = [...this.filteredData]; // อัปเดตข้อมูลใน ag-Grid
    } else {
      // ถ้าไม่มี criteria หรือเป็นค่าว่าง ให้แสดงข้อมูลทั้งหมด
      this.filteredData = [...this.originalData];
      this.rowData = [...this.originalData];
    }
  }

  updateCriteria(newCriteria: any): void {
    this.criteria = newCriteria;
    // กรองข้อมูลตาม criteria ใหม่
    this.filteredData = this.filterData(this.originalData, this.criteria);
    this.rowData = [...this.filteredData]; // อัปเดตข้อมูลใน ag-Grid
  }

  // ฟังก์ชันกรองข้อมูล
  filterData(data: any[], criteria: any): any[] {
    console.log('Data being filtered:', data);
    console.log('Filtering criteria:', criteria);

    // หาก criteria เป็นค่าว่างทั้งหมดยังไม่ทำการกรอง
    if (
      !criteria.teacher_code &&
      !criteria.fullname &&
      !criteria.email &&
      !criteria.role
      // !criteria.active_status
    ) {
      return data;
    }

    return data.filter((item) => {
      const fullname = `${item['prefix'] || ''} ${item['firstname'] || ''} ${
        item['lastname'] || ''
      }`.toLowerCase();

      const isMatching =
        (!criteria.teacher_code ||
          item['teacher_code']
            ?.toLowerCase()
            .includes(criteria.teacher_code?.toLowerCase())) &&
        (!criteria.email ||
          item['email']
            ?.toLowerCase()
            .includes(criteria.email?.toLowerCase())) &&
        (!criteria.role || item['role'] === criteria.role) &&
        // (!criteria.active_status ||
        //   item['active_status'] === criteria.active_status) &&
        (!criteria.fullname ||
          fullname.includes(criteria.fullname?.toLowerCase()));

      return isMatching;
    });
  }

  matchAnyField(searchString: string, item: any): boolean {
    const lowerCaseSearchString = searchString.toLowerCase();

    const fullName =
      `${item.prefix} ${item.firstname} ${item.lastname}`.toLowerCase();
    return fullName.includes(lowerCaseSearchString);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // เมื่อไฟล์ถูกวางลง
  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
  
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
  
        if (this.validateFields(jsonData)) {
          ////debugger;
          const modifiedData = this.processData(jsonData);
  
          // เคลียร์ข้อมูลเก่าก่อนโหลดข้อมูลใหม่
          this.rowData = [];  // เคลียร์ rowData
          this.originalData = [];  // เคลียร์ originalData
  
          this.LoadGridData(modifiedData); // โหลดข้อมูลใหม่
          this.isFileUploaded = true;
          this.isUploaded.emit(true);
        } else {
          alert('ไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์ที่มีฟิลด์ครบถ้วน');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }
  
  processData(data: any[]): any[] {
    return data.map((row, index) => ({
      row_id: index,
      email: row['อีเมล'] || row['email'] || null,
      teacher_code: row['รหัสอาจารย์'] || row['teacher_code'] || null,
      prefix: row['คำนำหน้า'] || row['prefix'] || null,
      firstname: row['ชื่อ'] || row['firstname'] || null,
      lastname: row['นามสกุล'] || row['lastname'] || null,
      role: row['หน้าที่'] || row['role'] || null,
    }));
  }

  LoadGridData(data: any[]) {
    if (data.length > 0) {
      ////debugger;
      console.log('Original data: ', data);

      // คำนิยามคอลัมน์ที่แสดงใน ag-Grid เป็นภาษาไทย
      this.columnDefs = Object.keys(data[0]).map((key) => {
        let customWidth = 100;
        let flexValue = 1;
        let cellClass = '';
        let headerName = '';
        let cellEditor = null;

        switch (key) {
          case 'row_id':
            headerName = 'ลำดับ';
            customWidth = 70;
            flexValue = 0.3;
            break;
          case 'email':
            headerName = 'อีเมล';
            customWidth = 70;
            flexValue = 1.7;
            break;
          case 'teacher_code':
            headerName = 'รหัสอาจารย์';
            customWidth = 70;
            flexValue = 0.8;
            break;
          case 'prefix':
            headerName = 'คำนำหน้า';
            customWidth = 70;
            flexValue = 0.6;
            cellEditor = 'agSelectCellEditor';
            break;
          case 'firstname':
            headerName = 'ชื่อ';
            customWidth = 70;
            flexValue = 1.2;
            break;
          case 'lastname':
            headerName = 'นามสกุล';
            customWidth = 70;
            flexValue = 1.2;
            break;
          case 'role':
            headerName = 'หน้าที่';
            customWidth = 70;
            flexValue = 0.8;
            cellClass = 'text-end';
            cellEditor = 'agSelectCellEditor';
            break;
          // case 'active_status':
          //   headerName = 'สถานะการใช้งาน';
          //   customWidth = 70;
          //   flexValue = 0.8;
          //   cellClass = 'text-end';
          //   break;
          default:
            headerName = key;
            customWidth = 160;
        }

        return {
          field: key, // Field name to be used in the API
          headerName: headerName, // Column header name
          // editable: true,
          flex: flexValue,
          minWidth: customWidth,
          cellRenderer: (params: any) => {
            const value = params.value?.toString().trim();
            if (value === '' || value === null || value === undefined) {
              return '<span style="color: red; font-weight: bold; background-color: #ffcccc; padding: 2px 5px; border-radius: 3px;">NULL</span>';
            } else if (value === '-') {
              return '<span style="color: red; font-weight: bold;">-</span>';
            }
            return params.value;
          },
          // Apply select-box for prefix and role only
          cellEditorParams: key === 'prefix' ? {
            values: this.prefixData.map(item => item.byte_desc_th),
          } : key === 'role' ? {
            values: this.roleData.map(item => item.byte_desc_th),
          } : null,
          cellEditor: cellEditor, // Apply select-box editor
        };
      });

      this.columnDefs.push({
        headerName: '',
        field: 'action',
        width: 150,
        cellRenderer: (params: any) => {
          const rowId = params.data.row_id; // Use row_id to identify the row
          
          // Create container for delete button
          const container = document.createElement('div');
          container.innerHTML = `
            <button class="btn btn-danger btn-sm">Delete</button>
          `;
          
          // Add event listener for delete
          container.querySelector('.btn-danger')?.addEventListener('click', () => {
            this.onDeleteRow(rowId);  // Pass row_id to onDeleteRow method
          });
      
          return container;
        },
        suppressHeaderMenuButton: true,
      });
      
      // Processed Data
      const processedData = data.map((row) => {
        const updatedRow: any = {};
        Object.keys(row).forEach((key) => {
          updatedRow[key] =
            row[key]?.toString().trim() === '' ? null : row[key];
        });
        return updatedRow;
      });

      this.rowData = [...data];
      this.originalData = [...data];
      
      console.log("Data load: ", this.rowData);
    } else {
      console.log('No data to load');
    }
  }
  
  // onCellValueChanged(event: any) {
  //   const updatedData = event.data;  
  //   // ทำการอัปเดตข้อมูลหรือส่งข้อมูลไปยัง server
  //   console.log('Cell value changed:', updatedData);
  // }
  
  // onDeleteRow(rowId: number) {
  //   const rowIndex = this.originalData.findIndex(row => row.row_id === rowId);
    
  //   if (rowIndex !== -1) {
  //     Swal.fire({
  //       title: 'คุณยืนยันที่จะลบข้อมูลผู้ใช้นี้?',
  //       text: 'คำเตือน: หากลบไปแล้วจะไม่สามารถนำกลับมาได้อีก',
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#d33',
  //       cancelButtonColor: '#3085d6',
  //       confirmButtonText: 'ลบ',
  //       cancelButtonText: 'ยกเลิก',
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         // Remove the row from the original data array
  //         this.originalData.splice(rowIndex, 1);
  
  //         // Update rowData for the grid
  //         this.rowData = [...this.originalData];
  
  //         // Reassign row_id to maintain sequential row numbering
  //         this.rowData = this.rowData.map((row, index) => {
  //           row.row_id = index + 1;
  //           return row;
  //         });
  
  //         if (this.gridApi) {
  //           this.gridApi.refreshCells({ force: true });
  //         } else {
  //           console.error('Grid API is not available.');
  //         }

  //         // if (this.gridApi) {
  //         //   this.gridApi.refreshRows();
  //         // } else {
  //         //   console.error('Grid API is not available.');
  //         // }

  //         // if (this.gridApi) {

  //         //   this.gridApi.setRowData(this.rowData);
  //         //   this.gridApi.refreshCells({ force: true });
  //         // }
  
  //         console.log('Row deleted successfully.');
  
  //         // this.gridApi.setRowData(this.originalData);
  //         console.log('Row deleted');
  //       } else {
  //         console.log('Row deletion canceled');
  //       }
  //     });
  //   } else {
  //     console.log("Row not found to delete.");
  //   }
  // }

  onDeleteRow(rowId: number) {
    console.log(this.originalData)
    const rowIndex = this.originalData.findIndex(row => row.row_id === rowId);
    console.log(rowIndex);
    console.log(rowId);
    if (rowIndex !== -1) {
      Swal.fire({
        title: 'คุณยืนยันที่จะลบข้อมูลผู้ใช้นี้?',
        text: 'คำเตือน: หากลบไปแล้วจะไม่สามารถนำกลับมาได้อีก',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ลบ',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          
          // console.log('Row rowData', this.rowData);
          // console.log('Row originalData', this.originalData);
          // console.log("MyRowID: ", rowId - 1);
          // Remove the row from the original data array
          // this.originalData.splice(rowIndex, 1);

          // // Update rowData for the grid
          // this.rowData = this.originalData;

          // // Reassign row_id to maintain sequential row numbering
          // this.rowData = this.rowData.map((row, index) => {
          //   row.row_id = index + 1;
          //   return row;
          // });

          if (this.gridApi) {
            // Remove the row from the original data array
            this.originalData.splice(rowIndex, 1);
          
            // Update rowData for the grid
            
          
            // Reassign row_id to maintain sequential row numbering
            // this.rowData = this.rowData.map((row, index) => {
            //   row.row_id = index + 1;
            //   return row;
            // });
            
            // Apply the transaction to update the rows
            this.gridApi.applyTransaction({
              remove: this.originalData.filter(row => row.row_id === rowIndex)
            });
            this.rowData = [...this.originalData];
            this.gridApi.setGridOption("rowData", this.rowData);
            // Optionally refresh the grid to ensure display is updated
            this.gridApi.refreshCells({ force: true });
          }          

          console.log('Row rowData', this.rowData);
          console.log('Row originalData', this.originalData);
          console.log('Row deleted successfully.');
        } else {
          console.log('Row deletion canceled');
        }
      });
    } else {
      console.log("Row not found to delete.");
    }
  }
  
  onSaveData() {
    // ตรวจสอบว่ามีข้อมูลในตารางหรือไม่
    if (!this.rowData || this.rowData.length === 0) {
      Swal.fire({
        title: 'ไม่มีข้อมูล',
        text: 'กรุณาอัปโหลดข้อมูลก่อนบันทึก',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
      return;
    }

    // ตรวจสอบฟิลด์ที่ว่างเปล่าในแต่ละแถว
    const missingFieldsGrouped = this.rowData
      .map((row, index) => {
        const missingFields = this.requiredFields.filter(
          (field) =>
            !row[field] ||
            row[field].toString().trim() === '' ||
            row[field].toString().trim().toUpperCase() === 'NULL'
        );
        return missingFields.length > 0
          ? `แถวที่ ${index + 1}: ${missingFields.join(', ')}`
          : null;
      })
      .filter((item) => item !== null);

    // หากมีฟิลด์ที่ว่างเปล่า แสดงการแจ้งเตือน
    if (missingFieldsGrouped.length > 0) {
      Swal.fire({
        title: 'ข้อมูลไม่ครบถ้วน',
        html: `พบฟิลด์ที่ยังไม่ได้กรอก:<br>${missingFieldsGrouped.join(
          '<br>'
        )}`,
        icon: 'warning',
        confirmButtonColor: '#0d6efd',
        confirmButtonText: 'ตกลง',
      });
      return;
    }

    const UserInfo = this.UserService.username;
    
    // กำหนดข้อมูลที่ต้องการส่ง
    const dataToSend = this.rowData.map((row) => {
      const { create_date, ...filteredRow } = row;
      return {
        ...filteredRow,
        create_by: UserInfo,
      };
    });
    
    // ส่งข้อมูลไปยัง API
    this.addUserService.insertUser(dataToSend).subscribe(
      (response) => {
        Swal.fire({
          title: 'บันทึกข้อมูลสำเร็จ',
          text: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonColor: '#0d6efd',
          confirmButtonText: 'ตกลง',
        }).then(() => {
          this.router.navigate(['/UserManagement']);
        });
      },
      (error) => {
        console.error('Error occurred while inserting user data: ', error);
    
        // Check if errors exist in the response
        if (error && error.errors) {
          const errorMessages = error.errors;
    
          // If there are duplicate emails or other errors, display them
          if (errorMessages.length > 0) {
            //debugger;
            Swal.fire({
              title: 'เกิดข้อผิดพลาด',
              html: `พบอีเมลที่ซ้ำกัน:<br>${errorMessages.join('<br>')}`,
              icon: 'error',
              confirmButtonColor: '#0d6efd',
              confirmButtonText: 'ตกลง',
            });
            return; // Do not proceed with saving data if there are errors
          }
        }
    
        // If no specific errors are found, show a general error message
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง',
          icon: 'error',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#0d6efd',
        });
      }
    );
  }

  onDelete() {
    Swal.fire({
      title: 'ต้องการลบข้อมูลใช่หรือไม่',
      text: 'หลังจากลบข้อมูลแล้วจะไม่สามารถกลับมาแก้ไขได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'ลบ',
      cancelButtonColor: 'var(--secondary-color)',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.rowData = [];
        this.originalData = [];
        this.isFileUploaded = false;
        this.isUploaded.emit(false);
        console.log(this.rowData);
        console.log('ข้อมูลถูกลบแล้ว');
      } else if (result.isDismissed) {
        console.log('การบันทึกถูกยกเลิก');
      }
    });
  }

  validateFields(data: any[]): boolean {
    const requiredFields = [
      'อีเมล',
      'รหัสอาจารย์',
      'คำนำหน้า',
      'ชื่อ',
      'นามสกุล',
      'หน้าที่',
    ];
    const fileFields = Object.keys(data[0]);

    const missingFields = requiredFields.filter(
      (field) => !fileFields.includes(field)
    );
    if (missingFields.length > 0) {
      Swal.fire({
        title: 'หัวคอลัมน์ไม่ถูกต้อง',
        html: `กรุณาแก้ไขไฟล์ Excel ให้มีคอลัมน์ดังนี้:<br>${missingFields.join(
          '<br>'
        )}`,
        icon: 'warning',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#0d6efd',
      });
      return false;
    }
    return true;
  }
}