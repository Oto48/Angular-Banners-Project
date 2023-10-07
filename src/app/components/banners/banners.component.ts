import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../services/banner.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent {
  banners: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'channelId'];
  page = 0;
  length = 0;
  pageSize = 10;

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.loadBanners(0);
  }

  handleImageError(event: any) {
    event.target.src =
      'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';
  }

  onPageChange(event: any): void {
    const pageIndex = event.pageIndex;
    this.loadBanners(pageIndex);
  }

  private loadBanners(pageIndex: number): void {
    this.bannerService.getBanners(pageIndex).subscribe((banners) => {
      this.banners = banners.entities;
      this.length = banners.total;
    });
  }
}
