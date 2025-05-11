import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ISiswa, IUser } from 'src/app/Interfaces/index.interface';

export type TStorageName = 
    'token'
  | 'user'
  | 'siswa'
  | 'wali'
;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  token?: string;
  user? : IUser;
  siswa?: ISiswa;
  wali? : any;

  constructor() {
    const promises: Promise<any>[] = [];
    ['token', 'user', 'siswa', 'wali'].forEach((storageKey) => {
      promises.push(this.reStorage((storageKey as TStorageName)));
    });

    Promise.all(promises);
    new Promise((resolve) => {
    })
  }

  storeStorage(name: TStorageName, payload: any) {
    return this.setStorage(name, payload)
      .then((_) => { this[name] = payload })
  }

  reStorage(name: TStorageName) {
    return this.getStorage(name)
      .then((result: any | undefined ) => this[name] = result)
  }

  async removeStorage(key: string): Promise<void> {
    return Preferences.remove({
      key: key
    });
  }

  async clearStorage(): Promise<void> {
    return Preferences.clear();
  }

  storeExamAnswer(examId: string, answer: Record<any, any>) {
    return this.setStorage(examId, answer);
  }

  getStoredExamAnswer(examId: string): Record<any, any> | undefined {
    return this.getStorage(examId);
  }

  clearStoredExamAnswer(examId: string) {
    return this.removeStorage(examId);
  }

  storeExamTimer(examId: string, second: number) {
    return this.setStorage(`timer_${examId}`, second);
  }

  getStoredExamTimer(examId: string) {
    return this.getStorage(`timer_${examId}`);
  }

  clearStoredExamTimer(examId: string) {
    return this.removeStorage(`timer_${examId}`);
  }

  private setStorage(key: string, value: any): Promise<void> {
    return Preferences.set({
      key: key,
      value: JSON.stringify(value)
    });
  }

  private getStorage(key: string): any | undefined {
    return Preferences.get({ key: key })
      .then((result) => {
        if (result.value) {
          return JSON.parse(result.value)
        }
        return undefined;
      })
      .catch(_ => undefined);
  }
}
