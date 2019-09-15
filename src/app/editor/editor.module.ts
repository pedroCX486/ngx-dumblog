import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { CanvasComponent } from './canvas/canvas.component';


@NgModule({
  declarations: [CanvasComponent],
  imports: [
    CommonModule,
    EditorRoutingModule
  ]
})
export class EditorModule { }
