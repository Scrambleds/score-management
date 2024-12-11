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
  @Input() set value(val: string) {
    this.inputValue = val || ''; // อัปเดตค่า inputValue
  }
  @Output() search = new EventEmitter<string>();
  @Output() select = new EventEmitter<any>();

  @ViewChild('autocompleteContainer') autocompleteContainer!: ElementRef;

  inputValue: string = '';
  isAutocompleteVisible = false;
  dropdownPosition: 'top' | 'bottom' = 'bottom';

  constructor(private elementRef: ElementRef) {}

  @HostListener('window:resize')
  onWindowResize(): void {
    this.adjustDropdownPosition();
  }

  onSearch(): void {
    this.search.emit(this.inputValue);
    this.adjustDropdownPosition();
  }

  showAutocomplete(): void {
    this.isAutocompleteVisible = true;
    this.adjustDropdownPosition();
  }

  hideAutocomplete(): void {
    setTimeout(() => {
      this.isAutocompleteVisible = false;
    }, 100);
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
    this.inputValue = item[this.displayKey];
    this.isAutocompleteVisible = false;
    this.select.emit(item);
  }
}
