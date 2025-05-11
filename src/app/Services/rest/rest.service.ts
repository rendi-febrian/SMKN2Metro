import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { GlobalService } from 'src/app/Services/global/global.service';
import { StorageService } from 'src/app/Services/storage/storage.service';
import { IFetch } from 'src/app/Interfaces/http.interface';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  apiUrl        : string | undefined;
  requestTimeout: number | undefined;

  constructor(
    private http         : HttpClient,
    private globalService: GlobalService,
  ) {
    this.setApiUrl();
    this.setApiTimeoutTime();
  }

  login(body: { email: string; password: string }): Promise<IFetch> {
    return new Promise((resolve, reject) => {
      this.http.post(
        `${this.apiUrl}/authorize`,
        JSON.stringify(body),
        { headers: this.getHeader() }
      )
      .pipe(timeout(this.requestTimeout!))
      .subscribe({
        next: successHelper.bind(this, resolve),
        error: errorHelper.bind(this, reject),
      })
    });
	}

  listData(
    module: 'pengumuman' | 'elearning' | 'ujian' | 'guru' | 'blog' | 'raport' | 'jadwal',
    criteria: any
  ): Promise<IFetch> {
    return new Promise((resolve, reject) => {
      this.http.post(
        `${this.apiUrl}/${module}/list`,
        criteria,
        { headers: this.getHeader() }
      )
      .pipe(timeout(this.requestTimeout!))
      .subscribe({
        next: successHelper.bind(this, resolve),
        error: errorHelper.bind(this, reject),
      })
    });
	}

  getDetailData(
    module: 'pengumuman' | 'elearning' | 'ujian' | 'guru' | 'blog' | 'raport',
    criteria: any,
  ): Promise<IFetch> {
    return new Promise((resolve, reject) => {
      this.http.post(
        `${this.apiUrl}/${module}/detail`,
        criteria,
        { headers: this.getHeader() }
      )
      .pipe(timeout(this.requestTimeout!))
      .subscribe({
        next: successHelper.bind(this, resolve),
        error: errorHelper.bind(this, reject),
      })
    });
  }

  saveData(
    module: 'ujian',
    criteria: any,
  ): Promise<IFetch> {
    return new Promise((resolve, reject) => {
      this.http.post(
        `${this.apiUrl}/${module}/save`,
        criteria,
        { headers: this.getHeader() }
      )
      .pipe(timeout(this.requestTimeout!))
      .subscribe({
        next: successHelper.bind(this, resolve),
        error: errorHelper.bind(this, reject),
      })
    });
  }

  getServerTime(criteria: any): Promise<IFetch<string>> {
    return new Promise((resolve, reject) => {
      this.http.post(
        `${this.apiUrl}/server-time`,
        criteria,
        { headers: this.getHeader() }
      )
      .pipe(timeout(this.requestTimeout!))
      .subscribe({
        next: successHelper.bind(this, resolve),
        error: errorHelper.bind(this, reject),
      })
    });
  }

  getAbsenStatus(criteria: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(
        `${this.apiUrl}/absensi`,
        criteria,
        { headers: this.getHeader() }
      )
      .pipe(timeout(this.requestTimeout!))
      .subscribe({
        next: successHelper.bind(this, resolve),
        error: errorHelper.bind(this, reject),
      })
    });
  }

  saveAbsen(criteria: any): Promise<IFetch> {
    return new Promise((resolve, reject) => {
      this.http.post(
        `${this.apiUrl}/do-absen`,
        criteria,
        { headers: this.getHeader() }
      )
      .pipe(timeout(this.requestTimeout!))
      .subscribe({
        next: successHelper.bind(this, resolve),
        error: errorHelper.bind(this, reject),
      })
    });
  }

	saveProfile(criteria: any): Promise<IFetch> {
    return new Promise((resolve, reject) => {
      this.http.post(
        `${this.apiUrl}/siswa/edit`,
        criteria,
        { headers: this.getHeader() }
      )
      .pipe(timeout(this.requestTimeout!))
      .subscribe({
        next: successHelper.bind(this, resolve),
        error: errorHelper.bind(this, reject),
      })
    });
  }

  private setApiUrl() {
    const apiUrlMode 	= this.globalService.config('apiUrlMode');
    if (apiUrlMode === 0) {
      this.apiUrl = this.globalService.config('apiUrlOffline') as string;
      return;
    }
    this.apiUrl = this.globalService.config('apiUrlOnline') as string;
  }

  private setApiTimeoutTime() {
    this.requestTimeout = this.globalService.config('requestTimeout') as number;
  }

  private getHeader() {
    const headers = new HttpHeaders(
      {
        'Access-Control-Allow-Origin':'*',
        'Content-Type' : 'application/json',
      }
    );

    return headers;
  }
}


function errorHelper(reject: (response: any) => void, response: any) {
  reject(response);
}

function successHelper(resolve: (response: any) => void, response: any) {
  resolve(response);
}
