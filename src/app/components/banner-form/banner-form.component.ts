import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
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
  image: File | null = null;
  languages: string[] = ['GE', 'EN', 'FR', 'DE'];
  zoneList: string[] = ['Header', 'Right Sidebar', 'Footer', 'Main Hero Slider'];
  imageName: string = '';
  imageSrc: string = '' ;
  uploading: boolean = false;
  removing: boolean = false;
  deleteBanner: boolean = false;

  @Output() saveItem = new EventEmitter<any>();
  @ViewChild('fileInput') fileInput: any;

  constructor(private fb: FormBuilder, private bannerService: BannerService, public drawerService: DrawerService) {
    const randomId = Math.floor(100000000 + Math.random() * 900000000);

    this.form = this.fb.group({
      id: [randomId, Validators.required],
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
        this.deleteBanner = true;
        this.form.patchValue(data);
        this.imageSrc = data.img;
        this.populateLabels(data.labels);
      }
    });
  }

  // Open or close form and reset all the data
  toggleDrawer() {
    this.clearLabels();
    this.drawerService.toggleDrawer();
    this.form.reset({ id: this.randomId(), active: false });
    this.imageSrc = '';
    this.imageName = '';
    this.deleteBanner = false;
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      this.image = inputElement.files[0];
      this.imageName = this.image ? this.image.name : '';
    }
  }

  selectImage(): void {
    // Trigger the original file input element when the button is clicked
    this.fileInput.nativeElement.click();
  }

  // Upload image in backend
  uploadImage():void {
    if (this.image) {
      this.uploading = true;

      this.bannerService.uploadImage(this.image).subscribe(
        (response: any) => {
          this.uploading = false;

          this.form.patchValue({ fileId: response.id });
          this.bannerService.downloadBlob(response.id).subscribe(
            (image: Blob) => {
              const imageUrl = URL.createObjectURL(image);
              this.imageSrc = imageUrl;
            },
            (error) => {
              console.error('Error downloading image:', error);
            }
          );
        },
        (error) => {
          this.uploading = false;
          console.error('Image upload error:', error);
        }
      );
    }
  }

  // Add new label when button is clicked
  addLabelInput() {
    const newLabelControl = new FormControl('', Validators.required);
    this.labelControls.push(newLabelControl);
    const labelsArray = this.form.get('labels') as FormArray;
    labelsArray.push(newLabelControl);
  }

  // Remove label
  removeLabelInput(index: number) {
    this.labelControls.splice(index, 1);
    const labelsArray = this.form.get('labels') as FormArray;
    labelsArray.removeAt(index);
  }

  // Fetch the user's labels and set them to the form.
  populateLabels(labels: string[]) {
    const labelsArray = this.form.get('labels') as FormArray;
    labelsArray.clear();
    labels.forEach(() => {
      this.addLabelInput();
    });
    labelsArray.patchValue(labels);
  }

  clearLabels() {
    const labelsArray = this.form.get('labels') as FormArray;
    labelsArray.clear();
    this.labelControls = [];
  }

  // Remove Selected Banner.
  removeBanner() {
    const bannerId = this.form.get('id')?.value; // Get the ID of the banner to remove
    if (bannerId) {
      this.removing = true;
      this.bannerService.removeBanner(bannerId).subscribe((response) => {
        if (response.success) {
          this.saveItem.emit();
          this.form.reset({ id: this.randomId(), active: false });
          this.removing = false;
        }
      });
    }
  }

  // Generate a random 9-digit number
  randomId(): number {
    return Math.floor(100000000 + Math.random() * 900000000);
  }

  submit() {
    if (this.form.valid) {
      const formData = this.form.value;
      this.bannerService.saveBanner(formData).subscribe((response) => {
        this.saveItem.emit(response);
        this.form.reset({ id: this.randomId(), active: false });
        this.imageSrc = '';
        this.imageName = '';
        this.clearLabels();
      });
    }
  }
}
