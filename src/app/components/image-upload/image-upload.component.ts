import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BannerService } from '../../services/banner.service';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent {
  imageForm: FormGroup;
  image: File | null = null;
  uploading = false;
  uploadError: string | null = null;
  imageName = '';

  @Output() imageUploaded = new EventEmitter<string>();
  @ViewChild('fileInput') fileInput: any;

  constructor(private bannerService: BannerService, private http: HttpClient, private fb: FormBuilder) {
    this.imageForm = this.fb.group({
      image: [null, Validators.required],
    });
  }

  onFileSelected(event: any): void {
    this.image = event.target.files[0];
    this.imageName = this.image ? this.image.name : '';
  }

  selectImage(): void {
    // Trigger the original file input element when the button is clicked
    this.fileInput.nativeElement.click();
  }

  onSubmit(): void {
    if (!this.image) {
      this.uploadError = 'Please select an image to upload.';
      return;
    }

    this.uploadError = null;
    this.uploading = true;

    this.bannerService.uploadImage(this.image).subscribe(
      (response: any) => {
        // Handle successful image upload
        this.uploading = false;
        console.log('Image uploaded successfully. File ID:', response);
        this.imageUploaded.emit(response.id);
      },
      (error) => {
        // Handle upload error
        this.uploading = false;
        this.uploadError = 'An error occurred during image upload. Please try again.';
        console.error('Image upload error:', error);
      }
    );
  }
  
}
