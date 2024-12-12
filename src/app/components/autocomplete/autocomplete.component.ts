import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  standalone: false,

  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css',
})
export class AutocompleteComponent {
  @Input() placeholder: string = 'Search...';
  @Input() suggestions: any[] = [];
  @Input() displayKey: string = 'name';
  @Input() displayFormat?: TemplateRef<any>;
  @Input() widthAuto: boolean = false; // เพิ่ม Input Property
  @Input() disabled: boolean = false; // เพิ่ม Input Property
  @Input() readonly: boolean = false; // เพิ่ม Input Property
  private _value: string = '';
  @Input()
  set value(val: string) {
    this._value = val;
    this.inputValue = this._value; // อัปเดตค่าใน input
    console.log('set value', this.inputValue);
  }
  get value(): string {
    console.log('get value', this._value);
    return this._value;
  }
  @Output() search = new EventEmitter<string>();
  @Output() select = new EventEmitter<any>();

  @ViewChild('autocompleteContainer') autocompleteContainer!: ElementRef;

  inputValue: string = ''; // รับค่าจาก parent component
  isAutocompleteVisible = false;
  dropdownPosition: 'top' | 'bottom' = 'bottom';

  constructor(private elementRef: ElementRef) {}

  @HostListener('window:resize')
  onWindowResize(): void {
    this.adjustDropdownPosition();
  }

  onSearch(): void {
    console.log('onSearch');
    this.search.emit(this.inputValue);
    this.adjustDropdownPosition();
  }
  onInputChange(event: Event): void {
    console.log('onInputChange', event);
    const target = event.target as HTMLInputElement; // ใช้ type assertion
    if (target) {
      this.inputValue = target.value; // อัปเดตค่า inputValue
      this.onSearch(); // เรียกฟังก์ชันค้นหา
    }
  }
  showAutocomplete(): void {
    this.isAutocompleteVisible = true;
    this.adjustDropdownPosition();
  }

  hideAutocomplete(): void {
    setTimeout(() => {
      this.isAutocompleteVisible = false;
    }, 500);
  }

  adjustDropdownPosition(): void {
    const inputElement = this.elementRef.nativeElement.querySelector('input');
    const containerElement = this.autocompleteContainer?.nativeElement;
    if (inputElement && containerElement) {
      const inputRect = inputElement.getBoundingClientRect();
      const containerHeight = containerElement.offsetHeight;

      const spaceAbove = inputRect.top;
      const spaceBelow = window.innerHeight - inputRect.bottom;

      this.dropdownPosition =
        spaceBelow < containerHeight && spaceAbove > containerHeight
          ? 'top'
          : 'bottom';

      // Add the appropriate class for top/bottom positioning
      // containerElement.classList.remove('top', 'bottom');
      containerElement.classList.add(this.dropdownPosition);
      // กำหนดความกว้างเฉพาะเมื่อ widthAuto = false
      if (!this.widthAuto) {
        containerElement.style.width = `${inputRect.width}px`;
      }
    }
  }

  selectItem(item: any): void {
    if (item) {
      console.log('selectItem', item); // ตรวจสอบค่าที่ส่งมา
      this.inputValue = item[this.displayKey];
      this.isAutocompleteVisible = false;
      this.select.emit({
        subjectCode: item.subjectCode, // หรือชื่อ key ที่คุณต้องการ
        subjectName: item.subjectName, // หรือชื่อ key ที่คุณต้องการ
      });
    }
  }
  // selectItem(item: any): void {
  //   console.log('selectItem', item); // ตรวจสอบค่าที่ส่งมา
  //   this.inputValue = item[this.displayKey]; // อัปเดตค่าของ input
  //   this.isAutocompleteVisible = false; // ซ่อน dropdown

  //   // ส่งค่าที่ต้องการกลับไปที่ parent component
  //   this.select.emit({
  //     subjectCode: item.subjectCode, // หรือชื่อ key ที่คุณต้องการ
  //     subjectName: item.subjectName, // หรือชื่อ key ที่คุณต้องการ
  //   });
  // }
}
