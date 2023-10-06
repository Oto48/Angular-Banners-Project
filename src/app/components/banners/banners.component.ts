import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../services/banner.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent {
  banners: any[] = [];

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.bannerService.getBanners().subscribe((data: any) => {
      this.banners = data;
      console.log(this.banners);
    });
  }
}
