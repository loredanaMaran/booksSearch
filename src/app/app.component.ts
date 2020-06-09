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
  error = false;
  bookId = '';
  bookUrl: ((url: string) => string) | string = '';
  reviewUrl: ((url: string) => string) | string = '';
  books = [];
  searchKey: '';
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

  clear(){
    this.bookId = '';
    this.books = [];
    this.bookUrl = '';
    this.reviewUrl = '';
    this.error = true;
    this.searchKey = '';
  }

  getIdByIsbn(){
    this.books = [];
    console.log(this.isbnCode);
    this.http.get('/book/isbn/' + this.isbnCode)
      .subscribe(data => {
        console.log(data);
        this.bookId = data.toString();
        this.getBookById();
        this.error = false;
      }, error => {
        console.log(error);
        this.clear();
        this.error = true;
      });
  }

  sanitizeUrls(){
    this.books.forEach(book => {
      book.imageUrl = book.image_url ? this.sanitizer.bypassSecurityTrustUrl(book.image_url) : '';
      book.reviewsWidget = book.reviews_widget ? this.sanitizer.bypassSecurityTrustHtml(book.reviews_widget) : '';
      book.seriesWorks = book.series_works ? this.sanitizer.bypassSecurityTrustHtml(book.series_works) : '';
      if (book.authors?.author?.length){
        book.authors.author.forEach(author => {
            if (author.image_url?._){
              author.imageUrl = this.sanitizer.bypassSecurityTrustUrl(author.image_url._);
            }
          }
        );
      } else if (book.authors?.author?.image_url?._){
        book.authors.author.imageUrl = this.sanitizer.bypassSecurityTrustUrl(book.authors.author.image_url._);
      }
    });
  }

  getBookById(){
    this.books = [];
    this.http.get('/book/' + this.bookId)
      .subscribe((data: any) => {
        this.books.push(data.GoodreadsResponse.book);
        console.log(this.books);
        this.sanitizeUrls();
        this.books.forEach(book => {
          this.isbnCode = book.isbn || book.isbn13 || book.asin || book.kindle_asin || '';
          this.bookUrl = book.link ? book.link : ('https://www.goodreads.com/book/show/' + this.bookId);
          this.reviewUrl = book.isbn ? ('https://www.goodreads.com/review/isbn/' + book.isbn) : this.bookUrl;
        });
        this.error = false;
        this.searchKey = '';
      }, error => {
        console.log(error);
        this.clear();
        this.error = true;
      });
  }

  searchBook(){
    this.books = [];
    this.bookId = '';
    this.bookUrl = '';
    this.reviewUrl = '';
    this.error = false;
    this.isbnCode = '';
    this.http.get('/book/search/' + this.searchKey)
      .subscribe((data: any) => {
        if (Number(data?.GoodreadsResponse?.search['total-results']) > 0){
          console.log(Number(data?.GoodreadsResponse?.search['total-results']));
          if (data?.GoodreadsResponse?.search?.results?.work?.length){
            const res = data?.GoodreadsResponse?.search?.results?.work;
            res.forEach(item => {
              const book = item;
              book.id = item.best_book.id._;
              book.author = item.best_book.author;
              book.average_rating = typeof item.average_rating === 'string' ? item.average_rating : item.average_rating?._;
              book.title = item.best_book.title;
              book.image_url = item.best_book.image_url;
              book.ratings_count = item.ratings_count._;
              book.text_reviews_count = item.text_reviews_count._;
              this.books.push(book);
            });
            this.sanitizeUrls();
            console.log(this.books);
          } else {
            if (data?.GoodreadsResponse?.search?.results?.work?.best_book?.id?._){
              this.bookId = data?.GoodreadsResponse?.search?.results?.work?.best_book?.id?._;
              this.getBookById();
            }
          }
        } else {
          this.error = true;
        }
      }, error => {
        console.log(error);
        this.clear();
        this.error = true;
      });
  }

}
// https://www.goodreads.com/book/auto_complete?format=json&q=B0885HL24D
