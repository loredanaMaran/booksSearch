import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  @Input()  book: any;
  @Output() searchById: EventEmitter<any> = new EventEmitter();
  private sanitizer: DomSanitizer;
  constructor(sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  ngOnInit(): void {
    console.log(this.book.reviewsWidget);
  }

  searchBook(id){
    this.searchById.emit(id);
  }

}
