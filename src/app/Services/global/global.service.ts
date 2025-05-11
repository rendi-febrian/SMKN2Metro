import { NavigationService } from 'src/app/Services/navigation/navigation.service';
import { StorageService } from 'src/app/Services/storage/storage.service';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Injectable } from '@angular/core';

import { BackgroundColorOptions, StatusBar, StyleOptions, Style } from '@capacitor/status-bar';
import { EStatusCode } from 'src/app/Interfaces/index.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  loadingInstance?: HTMLIonLoadingElement;

  constructor(
    private platform         : Platform,
    private toastController  : ToastController,
    private storageService   : StorageService,
    private navigationService: NavigationService,
    private loadingController: LoadingController
  ) { }

  setSession() {
    this.isLogin.next(true);
  }

  removeSession() {
    this.isLogin.next(false);
  }
  

  checkPlatform(): 'android' | 'ios' | 'capacitor' | 'unsupported' {
    if(this.platform.is('android')) {
      return 'android';
    }
    else if(this.platform.is('ios')) {
      return 'ios';
    }
    else if(this.platform.is('capacitor')) {
      return 'capacitor';
    }
    else {
      return 'unsupported';
    }
  }

  dynamicStatusBar(theme: 'primary' | 'secondary') {
    if(!Capacitor.isPluginAvailable('StatusBar')) { return };
    const device = this.checkPlatform();

    if (device === 'android') {
      let optsStatusBar: BackgroundColorOptions = {
        color : '#006C67'
      }

      let optStatusInfoTheme: StyleOptions = {
        style: Style.Dark,
      }

      if(theme === 'primary') {
        optsStatusBar = {
          color : '#006C67'
        }
      }

      if(theme === 'secondary') {
        optsStatusBar = {
          color: '#F2F2F2'
        }
        optStatusInfoTheme = {
          style: Style.Light,
        }
      }

      StatusBar.setBackgroundColor(optsStatusBar);
      StatusBar.setStyle(optStatusInfoTheme)
    }
  }

  config(name:
      'versionApp'
    | 'apiUrlMode'
    | 'build'
    | 'apiUrlOnline'
    | 'apiUrlOffline'
    | 'requestTimeout'
    | 'assetUploadUrl'
  ): string | number {
    const config = {
      "versionApp"    : "5.0.0",
      "build"         : "1",
      "apiUrlMode"    : 1,
      // "apiUrlOnline"  : "https://v2.smkkartikatama.sch.id/api",
      // "apiUrlOffline" : "http://192.168.1.5/ADMINSMKOLD/api",
      // "assetUploadUrl": "http://192.168.1.5/ADMINSMKOLD/apps/public",
      "apiUrlOnline"  : "https://smkkartikatama.sch.id/api",
      "apiUrlOffline" : "https://adminsmkold.ae//api",
      "assetUploadUrl": "https://smkkartikatama.sch.id/apps/public",
      "requestTimeout": 30000,
    }
    return config[name];
  }

  async showToast(
    msg     : string = '',
    type    : 'secondary' | 'danger' | 'warning' | 'success' = 'secondary',
    duration: number = 1500
  ) {
    const toast = await this.toastController.create({
        message : msg,
        duration: duration,
        color   : type,
        cssClass: `toast-${type}`,
    });
    toast.present();
  }

  async showLoading(): Promise<HTMLIonLoadingElement> {
    this.loadingInstance = await this.loadingController.create({
      message : '<ion-spinner name="crescent" color="primary"></ion-spinner>',
      translucent: true,
      showBackdrop: true,
      spinner: null,
    });
    this.loadingInstance.present();

    return this.loadingInstance;
  }

  hideLoading() {
    this.loadingInstance?.dismiss();
  }

  errorHandler(error: any, mainMessage: string) {
    if (error.status === EStatusCode.NO_INTERNET) {
      this.showToast('INTERNET ERR: No Connection Found', 'danger', 2000);
      return;
    }
    if (error.status === EStatusCode.UNAUTHENTICATED) {
      this.storageService.clearStorage();
      this.navigationService.toLoginpage();
      this.showToast('SESSION ERR: Sesi habis, kamu perlu login kembali', 'warning', 2000);
      return;
    }
    if (error.status === EStatusCode.NOT_FOUND && error.message.toLowerCase().includes('404 not found')) {
      this.showToast(`ROUTE ERR: ${mainMessage}`, 'danger', 2000);
      return;
    }
    if (error.status === EStatusCode.SERVER_ERROR && !error.msg) {
      this.showToast(`SERVER ERR: ${mainMessage}`, 'danger', 2000);
      return;
    }
    if (error.msg) {
      this.showToast(error.msg, 'danger', 2000);
      return;
    }
    this.showToast(`ERR: ${mainMessage}`, 'danger', 2000);
  }
}
