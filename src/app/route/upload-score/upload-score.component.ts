import { Component, Input, ViewChild } from '@angular/core';
import { UploadScoreHeaderComponent } from '../../components/upload-score-header/upload-score-header.component';
import { UploadExcelContainerComponent } from '../../components/upload-excel-container/upload-excel-container.component';

@Component({
  selector: 'app-upload-score',
  standalone: false,

  templateUrl: './upload-score.component.html',
  styleUrl: './upload-score.component.css',
})
export class UploadScoreComponent {
  isFileUploaded = false; // flag ตรวจสอบการอัปโหลดไฟล์
  @ViewChild('scoreHeader') scoreHeader!: UploadScoreHeaderComponent;
  @ViewChild('scoreContent')
  scoreContent!: UploadExcelContainerComponent;
  private formData: any;

  handleUploadEvent(isUploaded: boolean): void {
    this.isFileUploaded = isUploaded;
    console.log('File upload isUploaded:', isUploaded);
  }

  handleSubmitRequest() {
    // 6. call fn: onSubmit form UploadScoreHeaderComponent
    this.scoreHeader.onSubmit();
  }

  // 10. call&send FormData to fn: sendToApi form UploadExcelContainerComponent
  handleFormSubmitted(formData: any) {
    this.formData = formData;
    console.log('Received Form Data from B:', this.formData);

    this.scoreContent.sendToApi(formData);
  }
}
