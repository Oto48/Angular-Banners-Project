import { Component, OnInit, ViewChild } from '@angular/core';
import { BannerService } from '../../services/banner.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort,Sort} from '@angular/material/sort';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent implements OnInit {
  pageSize = 10;
  length = 0;
  page = 0;
  isDrawerOpen = false;
  altImg = 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';

  dataSource!: MatTableDataSource<any>;

  displayedColumns: string[] = [
    'id',
    'name',
    'channelId',
    'language',
    'zoneId',
    'priority',
    'fileId',
    'startDate',
    'endDate',
    'active',
    'img',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private bannerService: BannerService) {
    this.sort = new MatSort();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any[]>([]);
    this.loadBanners(0, this.sort.active, this.sort.direction);
  }

  // Event handler for sorting change
  onSortChange(): void {;
    this.dataSource.sort = this.sort;
  }

  // Event handler for page change
  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.loadBanners(this.page, this.sort.active, this.sort.direction);
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
        this.length = banners.total;
        this.dataSource.data = banners.entities;
        this.dataSource.data.forEach((element) => {
          this.getImage(element);
        });
      });
  }

  openDrawer(item?: any) {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.bannerService.setBannerData(item);
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  saveItem(newItem: any) {
    const index = this.dataSource.data.find((banner) => banner.id === newItem.data.id);
    if (index) {
      Object.assign(index, newItem.data);
      this.getImage(index);
      this.toggleDrawer();
    } else {
      this.getImage(newItem.data);
      this.loadBanners(this.page, this.sort.active, this.sort.direction);
      this.toggleDrawer();
    }
  }

  getImage(data: any): void {
    this.bannerService.downloadBlob(data.url).subscribe(
      (image: Blob) => {
        const imageUrl = URL.createObjectURL(image);
        data.img = imageUrl;
      },
      (error) => {
        console.error('Error downloading image:', error);
      }
    );
  }
}
