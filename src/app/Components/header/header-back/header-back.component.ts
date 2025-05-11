import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-back',
  templateUrl: './header-back.component.html',
  styleUrls: ['./header-back.component.scss'],
  standalone : false
})
export class HeaderBackComponent implements OnInit {
  @Input()
  isTitleVisible: boolean = false;

  @Input()
  title: string = '';

  @Input()
  theme: 'white' | 'primary' = 'primary';

  @Input()
  hideBackButton: boolean = false;

  @Output()
  backClick: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

}
