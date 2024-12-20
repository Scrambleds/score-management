import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

@Pipe({
  name: 'translateDropdown',
  pure: false,
  standalone: false,
})
export class TranslateDropdownPipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(
    options: any[],
    lang: string = localStorage.getItem('language') || 'en',
    textKey?: { th: string; en: string } // Optional Parameter
  ): { value: string; text: string }[] {
    //     let translation = this.translationService.getTranslation(value) || value;
    if (!options || !Array.isArray(options)) return [];
    //default value
    const defaultTextKey = { th: 'byte_desc_th', en: 'byte_desc_en' };
    const keys = textKey || defaultTextKey;

    return options.map((item) => ({
      value: item.placeholder_key || item.byte_code || '',
      text: lang === 'th' ? item[keys.th] : item[keys.en],
    }));
  }
}
