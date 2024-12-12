import { Component, Input } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload-excel-container',
  standalone: false,

  templateUrl: './upload-excel-container.component.html',
  styleUrl: './upload-excel-container.component.css',
})
export class UploadExcelContainerComponent {
  @Input() titleName: string = 'No title'; // รับค่าจาก Parent
  @Input() buttonName: string = 'No title'; // รับค่าจาก Parent
  rowData: any[] = []; // ข้อมูลที่จะแสดงใน ag-Grid
  columnDefs: any[] = []; // คำนิยามของคอลัมน์
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  // เมื่อผู้ใช้ลากไฟล์เข้ามา
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

        // อ่านข้อมูลจาก Sheet แรก
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // แปลง Sheet เป็น JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        this.loadGridData(jsonData);
      };

      reader.readAsArrayBuffer(file);
    }
  }

  // แสดงข้อมูลใน ag-Grid
  loadGridData(data: any[]) {
    if (data.length > 0) {
      // สร้างคอลัมน์จาก key ใน JSON
      this.columnDefs = Object.keys(data[0]).map((key) => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
      }));
      this.rowData = data; // กำหนดข้อมูลให้ ag-Grid
    }
  }
}
