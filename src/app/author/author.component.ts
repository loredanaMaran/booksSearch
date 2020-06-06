import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {
  @Input() author: any;
  constructor() {
  }

  ngOnInit(): void {
    console.log(this.author, this.author.imageUrl);
  }

}
