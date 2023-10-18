import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  isDrawerOpen = false;

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
