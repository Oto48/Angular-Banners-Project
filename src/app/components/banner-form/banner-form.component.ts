import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BannerService } from '../../services/banner.service';

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.scss'],
})
export class BannerFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private bannerService: BannerService) {
    this.form = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      channelId: ['', Validators.required],
      language: ['', Validators.required],
      zoneId: ['', Validators.required],
      priority: ['', Validators.required],
      fileId: ['', Validators.required],
      url: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      active: ['', Validators.required],
    });

    // Subscribe to the bannerData$
    this.bannerService.bannerData$.subscribe((data) => {
      if (data) {
        // Update form fields with the received data
        this.form.patchValue(data);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      this.bannerService.saveBanner(formData).subscribe((response) => {
        console.log('Banner saved:', response);
      });
    }
  }
}
