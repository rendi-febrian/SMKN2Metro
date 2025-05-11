import { IUser } from 'src/app/Interfaces/user.interface';
import { ISiswa } from './../../../Interfaces/siswa.interface';
import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from 'src/app/Services/storage/storage.service';

@Component({
  selector: 'app-box-siswa',
  templateUrl: './box-siswa.component.html',
  styleUrls: ['./box-siswa.component.scss'],
  standalone : false
})
export class BoxSiswaComponent implements OnInit {
  @Input()
  siswa?: ISiswa;
  user = this.storageService.user;

  constructor(
    private storageService : StorageService
  ) { }

  ngOnInit() {}

}
