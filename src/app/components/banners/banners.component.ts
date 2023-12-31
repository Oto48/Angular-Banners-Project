import { Component, OnInit, ViewChild } from '@angular/core';
import { BannerService } from '../../services/banner.service';
import { DrawerService } from 'src/app/services/drawer.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Banner, SaveBannerRequest } from '../../interfaces/interfaces';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent implements OnInit {
  pageSize: number = 10;
  length: number = 0;
  page: number = 0;
  isDrawerOpen: boolean = false;
  searchQuery: string = '';
  altImg: string = 'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';

  dataSource!: MatTableDataSource<any>;

  displayedColumns: string[] = [
    'id',
    'name',
    'channelId',
    'language',
    'zoneId',
    'priority',
    'url',
    'startDate',
    'endDate',
    'active',
    'labels',
    'img',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private bannerService: BannerService, public drawerService: DrawerService) {
    this.sort = new MatSort();
  }

  // Fetch data
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any[]>([]);
    this.loadBanners(0, this.sort.active, this.sort.direction, this.searchQuery);
  }

  // Search banners
  onSearch() {
    this.page = 0;
    this.loadBanners(this.page, this.sort.active, this.sort.direction, this.searchQuery);
  }

  // Event handler for sorting change
  onSortChange(): void {;
    this.dataSource.sort = this.sort;
  }

  // Event handler for page change
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.loadBanners(this.page, this.sort.active, this.sort.direction, this.searchQuery);
  }

  // Private method to load banners
  private loadBanners(
    pageIndex: number,
    sortBy: string,
    sortDirection: string,
    searchQuery: string
  ): void {
    this.bannerService
      .getBanners(pageIndex, sortBy, sortDirection, searchQuery)
      .subscribe((banners) => {
        this.length = banners.total;
        this.dataSource.data = banners.entities;
        this.dataSource.data.forEach((element) => {
          this.getImage(element);
        });
      });
  }

  // Open form with selected data
  openDrawer(item: Banner) {
    if(!this.drawerService.isDrawerOpen) {
      this.toggleDrawer();
      this.bannerService.setBannerData(item);
    }
  }

  // Open form
  toggleDrawer() {
    this.drawerService.toggleDrawer();
  }

  // Save new banner or update existing one
  saveItem(newItem?: SaveBannerRequest) {
    if(newItem) {
      const index = this.dataSource.data.find((banner) => banner.id === newItem.data.id);
      if (index) {
        Object.assign(index, newItem.data);
        this.getImage(index);
      } else {
        this.getImage(newItem.data);
        this.loadBanners(this.page, this.sort.active, this.sort.direction, this.searchQuery);
      }
    } else {
      this.loadBanners(this.page, this.sort.active, this.sort.direction, this.searchQuery);
    }
  }
  
  // Fetch image
  getImage(data: any): void {
    this.bannerService.downloadBlob(data.fileId).subscribe(
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
