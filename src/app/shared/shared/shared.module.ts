import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


export const modules = [
  BrowserModule,
  BrowserAnimationsModule
];

@NgModule({
  declarations: [],
  imports: modules,
  exports: [...modules]
})
export class SharedModule { }
