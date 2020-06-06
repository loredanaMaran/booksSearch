import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { BookComponent } from './book/book.component';
import { AuthorComponent } from './author/author.component';
import { BookLinkComponent } from './book-link/book-link.component';
import { BookMiniComponent } from './book-mini/book-mini.component';

@NgModule({
  declarations: [
    AppComponent,
    BookComponent,
    AuthorComponent,
    BookLinkComponent,
    BookMiniComponent
  ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
