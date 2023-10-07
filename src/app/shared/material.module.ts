import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  exports: [MatButtonModule, MatCardModule, MatPaginatorModule],
})
export class MaterialModule {}
