import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';

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