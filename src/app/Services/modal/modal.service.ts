import { Injectable } from '@angular/core';

export type TModalNames = 
  'modalLoginForm'

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalLoginForm: HTMLIonModalElement | undefined;

  constructor() {}

  setModalInstances(name: TModalNames, modal: HTMLIonModalElement) {
    if (this[name]) { return; }
    this[name] = modal;
    this[name]?.onDidDismiss().then(_ => this[name] = undefined)
  }

  openModal(name: TModalNames) {
    if (!this[name]) { return; }
    this[name]?.present();
  }

  closeModal(name: TModalNames) {
    if (!this[name]) { return; }
    this[name]?.dismiss();
  }
}
