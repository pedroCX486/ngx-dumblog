import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { HomeComponent } from './home/home.component';
import { PostsComponent } from './posts/posts.component';


@NgModule({
  declarations: [HomeComponent, PostsComponent],
  imports: [
    CommonModule,
    BlogRoutingModule
  ]
})
export class BlogModule { }
