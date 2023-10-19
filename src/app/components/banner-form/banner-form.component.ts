import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BannerService } from '../../services/banner.service';
import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.scss'],
})
export class BannerFormComponent {
  form: FormGroup;
  labelControls: FormControl[] = [];

  @Output() saveItem = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private bannerService: BannerService, public drawerService: DrawerService) {
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
      active: [false],
      labels: this.fb.array([]),
    });

    // Subscribe to the bannerData$
    this.bannerService.bannerData$.subscribe((data) => {
      if (data) {
        // Update form fields with the received data
        this.form.patchValue(data);
      }
    });
  }

  toggleDrawer() {
    this.drawerService.toggleDrawer();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  addLabelInput() {
    const newLabelControl = new FormControl('', Validators.required);
    this.labelControls.push(newLabelControl);
    const labelsArray = this.form.get('labels') as FormArray;
    labelsArray.push(newLabelControl);
  }

  removeLabelInput(index: number) {
    this.labelControls.splice(index, 1);
    const labelsArray = this.form.get('labels') as FormArray;
    labelsArray.removeAt(index);
  }

  onImageUploaded(imageId: string): void {
    this.form.patchValue({ fileId: imageId });
  }

  submit() {
    if (this.form.valid) {
      const formData = this.form.value;
      this.bannerService.saveBanner(formData).subscribe((response) => {
        this.saveItem.emit(response);
        this.form.reset({ active: false });
      });
    }
  }
}
