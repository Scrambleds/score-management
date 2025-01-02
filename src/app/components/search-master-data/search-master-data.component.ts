import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-master-data',
  standalone: false,
  
  templateUrl: './search-master-data.component.html',
  styleUrl: './search-master-data.component.css'
})
export class SearchMasterDataComponent {
  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.searchForm = this.fb.group({
      searchInput: [''] 
    });
  }

  onSubmit(): void {
    const searchValue = this.searchForm.value.searchInput;
    console.log('Search submitted with value:', searchValue);

  }

  onReset(): void {
    this.searchForm.reset(); 
    console.log('Form reset');
  }
}