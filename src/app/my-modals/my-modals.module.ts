import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestTagComponent } from './test-tag/test-tag.component';
import { WriteTagComponent } from './write-tag/write-tag.component';



@NgModule({
  declarations: [
    TestTagComponent,
    WriteTagComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MyModalsModule { }
