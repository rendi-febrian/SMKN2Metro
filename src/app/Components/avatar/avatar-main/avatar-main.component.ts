import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar-main',
  templateUrl: './avatar-main.component.html',
  styleUrls: ['./avatar-main.component.scss'],
  standalone : false
})
export class AvatarMainComponent implements OnInit {
  @Input()
  url: string = '';

  @Input()
  size: 'md' | 'xl' = 'md'

  constructor() { }

  ngOnInit() {}

}
