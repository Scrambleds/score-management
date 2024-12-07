// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-ag-grid',
//   standalone: false,
  
//   templateUrl: './ag-grid.component.html',
//   styleUrl: './ag-grid.component.css'
// })
// export class AgGridComponent {

// }


import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'ag-grid',
  standalone: false,
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.css']
})
export class AgGridComponent {
  columnDefs: ColDef[] = [
    { headerName: 'Make', field: 'make' },
    { headerName: 'Model', field: 'model' },
    { headerName: 'Price', field: 'price' }
  ];

  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxster', price: 72000 }
  ];

}
