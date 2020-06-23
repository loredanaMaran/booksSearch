import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-book-mini',
  templateUrl: './book-mini.component.html',
  styleUrls: ['./book-mini.component.css']
})
export class BookMiniComponent implements OnInit {

  constructor() { }
  @Input() book: any;
  @Output() searchById = new EventEmitter<string>();
  ngOnInit(): void {}

}
