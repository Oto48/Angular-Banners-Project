import { Component } from '@angular/core';
import { DrawerService } from 'src/app/services/drawer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public drawerService: DrawerService) { }

  // open form
  toggleDrawer() {
    this.drawerService.toggleDrawer();
  }

}
