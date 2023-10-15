import { Component, Output, EventEmitter } from '@angular/core';
import { BannerService } from '../../services/banner.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: [],
})
export class ImageUploadComponent {
  image: File | null = null;
  uploadError: string | null = null;
  uploading = false;

  @Output() imageUploaded = new EventEmitter<string>();

  constructor(private bannerService: BannerService, private http: HttpClient) {}

  onFileSelected(event: any): void {
    this.image = event.target.files[0];
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
