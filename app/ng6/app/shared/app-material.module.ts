import { NgModule } from '@angular/core';
import { MatChipsModule, MatExpansionModule, MatButtonModule, MatTooltipModule, MatToolbarModule,
         MatSidenavModule, MatListModule, MatSelectModule, MatMenuModule, MatTabsModule,
         MatDialogModule, MatIconModule, MatTableModule, MatInputModule } from '@angular/material';

const materialModules = [
  MatToolbarModule,
  MatButtonModule,
  MatChipsModule,
  MatInputModule,
  MatSidenavModule,
  MatListModule,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatSelectModule,
  MatMenuModule,
  MatTabsModule,
  MatTableModule,
  MatTooltipModule
];

@NgModule({
  imports: materialModules,
  exports: materialModules,
})
export class AppMaterialModule { }
