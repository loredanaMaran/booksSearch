import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isbnCode = '';
  bookId = '';
  bookUrl: ((url: string) => string) | string = '';
  reviewUrl: ((url: string) => string) | string = '';
  book: any;
  sanitizer: DomSanitizer;
  constructor(private http: HttpClient, sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  ngOnInit() {}

  checkIfEnter(event){
    if (event && event.key === 'Enter'){
      this.getIdByIsbn();
    }
  }
  getIdByIsbn(){
    console.log(this.isbnCode);
    this.http.get('/book/isbn/' + this.isbnCode)
      .subscribe(data => {
        console.log(data);
        this.bookId = data.toString();
        this.getBookById();
      }, error => {
        console.log(error);
        this.bookUrl = '';
        this.reviewUrl = '';
      });
  }

  sanitizeUrls(){
    this.book.imageUrl = this.book.image_url ? this.sanitizer.bypassSecurityTrustUrl(this.book.image_url) : '';
    this.book.reviewsWidget = this.book.reviews_widget ? this.sanitizer.bypassSecurityTrustHtml(this.book.reviews_widget) : '';
    this.book.seriesWorks = this.book.series_works ? this.sanitizer.bypassSecurityTrustHtml(this.book.series_works) : '';
    if (this.book.authors?.author?.length){
      this.book.authors.author.forEach(author => {
          if (author.image_url?._){
            author.imageUrl = this.sanitizer.bypassSecurityTrustUrl(author.image_url._);
          }
        }
      );
    } else if (this.book.authors?.author?.image_url?._){
      this.book.authors.author.imageUrl = this.sanitizer.bypassSecurityTrustUrl(this.book.authors.author.image_url._);
    }
  }

  getBookById(){
    this.http.get('/book/' + this.bookId)
      .subscribe((data: any) => {
        this.book = data.GoodreadsResponse.book;
        console.log(this.book);
        this.sanitizeUrls();
        this.isbnCode = this.book.isbn || this.book.isbn13 || this.book.asin || this.book.kindle_asin || '';
        this.bookUrl = this.book.link ? this.book.link : ('https://www.goodreads.com/book/show/' + this.bookId);
        this.reviewUrl = this.book.isbn ? ('https://www.goodreads.com/review/isbn/' + this.book.isbn) : this.bookUrl;
      }, error => {
        console.log(error);
        this.bookUrl = '';
      });
  }

}
// https://www.goodreads.com/book/auto_complete?format=json&q=B0885HL24D
