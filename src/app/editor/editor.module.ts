import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EditorRoutingModule } from './editor-routing.module';
import { CanvasComponent } from './canvas/canvas.component';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [CanvasComponent],
  imports: [
    CKEditorModule,
    FormsModule,
    CommonModule,
    EditorRoutingModule
  ]
})
export class EditorModule { }
