import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-empty',
  templateUrl: './template-empty.component.html',
  styleUrls: ['./template-empty.component.scss'],
  standalone : false
})
export class TemplateEmptyComponent implements OnInit {
  @Input()
  title: string = 'Title Placeholder';

  @Input()
  message: string = 'Message Placeholder';

  @Input()
  theme: 'primary' | 'white' = 'primary';

  constructor() { }

  ngOnInit() {}

}
