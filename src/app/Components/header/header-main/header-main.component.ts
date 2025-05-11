import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-main',
  templateUrl: './header-main.component.html',
  styleUrls: ['./header-main.component.scss'],
  standalone : false
})
export class HeaderMainComponent implements OnInit {
  @Input()
  isContent: boolean = false;

  constructor() { }

  ngOnInit() {}

}
