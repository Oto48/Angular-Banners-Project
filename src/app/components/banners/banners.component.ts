import { Component, OnInit, ViewChild } from '@angular/core';
import { BannerService } from '../../services/banner.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent implements OnInit {
  banners: any[] = [];
  pageSize = 10;
  length = 0;
  page = 0;
  isDrawerOpen = false;

  selectedSort: string = 'id';
  selectedSortDirection: string = 'asc';

  sortOptions = [
    { label: 'id', value: 'id' },
    { label: 'channelId', value: 'channelId' },
    { label: 'language', value: 'language' },
    { label: 'zoneId', value: 'zoneId' },
    { label: 'zoneId', value: 'zoneId' },
  ];

  directionsSortOptions = [
    { label: 'asc', value: 'asc' },
    { label: 'desc', value: 'desc' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.loadBanners(0, this.selectedSort, this.selectedSortDirection);
  }

  // Event handler for sorting change
  onSortChange(): void {
    this.paginator.pageIndex = 0;
    this.loadBanners(0, this.selectedSort, this.selectedSortDirection);
  }

  // Event handler for sorting direction change
  onSortDirectionChange(): void {
    this.paginator.pageIndex = 0;
    this.loadBanners(0, this.selectedSort, this.selectedSortDirection);
  }

  // Event handler for page change
  onPageChange(event: any): void {
    const pageIndex = event.pageIndex;
    this.loadBanners(pageIndex, this.selectedSort, this.selectedSortDirection);
  }

  // Private method to load banners
  private loadBanners(
    pageIndex: number,
    sortBy: string,
    sortDirection: string
  ): void {
    this.bannerService
      .getBanners(pageIndex, sortBy, sortDirection)
      .subscribe((banners) => {
        this.banners = banners.entities;
        this.length = banners.total;
        this.banners.forEach((element) => {
          this.getImage(element);
        });
      });
  }

  openDrawer(item?: any) {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.bannerService.setBannerData(item);
  }

  closeDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  saveItem(newItem: any) {
    const index = this.banners.find((banner) => banner.id === newItem.data.id);
    if (index) {
      Object.assign(index, newItem.data);
    } else {
      this.banners.push(newItem.data);
    }
  }

  getImage(data: any): void {
    this.bannerService.downloadBlob(data.url).subscribe(
      (image: Blob) => {
        const imageUrl = URL.createObjectURL(image);
        data.img = imageUrl;
      },
      (error) => {
        data.img = 'none';
        console.error('Error downloading image:', error);
      }
    );
  }

  // Handle image loading error
  handleImageError(event: any) {
    event.target.src =
      'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';
  }
}
