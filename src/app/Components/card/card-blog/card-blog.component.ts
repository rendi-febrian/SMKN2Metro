import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-blog',
  templateUrl: './card-blog.component.html',
  styleUrls: ['./card-blog.component.scss'],
  standalone : false
})
export class CardBlogComponent implements OnInit {
  @Input()
  image: string = '/assets/images/default/blog.png';

  @Input()
  title: string = 'Blog Title';

  @Input()
  creator: string = 'Admin';

  constructor() { }

  ngOnInit() {}

}
