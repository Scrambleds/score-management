import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

@Pipe({
  name: 'translate',
  pure: false,
  standalone: false,
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(value: string, variables?: Record<string, string>): string {
    let translation = this.translationService.getTranslation(value) || value;

    if (variables) {
      Object.keys(variables).forEach((key) => {
        translation = translation.replace(`{${key}}`, variables[key]);
      });
    }
    return translation;
  }
}
