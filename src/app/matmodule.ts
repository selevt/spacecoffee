import { NgModule } from '@angular/core';
import { MatButtonModule, MatToolbarModule, MatExpansionModule, MatSnackBarModule } from '@angular/material';

@NgModule({
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatExpansionModule,
        MatSnackBarModule,
    ], exports: [
        MatToolbarModule,
        MatButtonModule,
        MatExpansionModule,
        MatSnackBarModule,
]})
export class MaterialModule { }