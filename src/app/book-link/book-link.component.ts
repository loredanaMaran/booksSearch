import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-book-link',
  templateUrl: './book-link.component.html',
  styleUrls: ['./book-link.component.css']
})
export class BookLinkComponent implements OnInit {
  @Input() link: any;
  @Input() bookId: string;
  constructor() { }

  ngOnInit(): void {
    this.link.url = this.link.link + '?book_id=' + this.bookId;
  }

}
