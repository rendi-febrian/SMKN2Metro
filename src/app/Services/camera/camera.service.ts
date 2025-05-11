import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Platform } from '@ionic/angular';
import { Directory, Filesystem } from '@capacitor/filesystem';

const IMAGE_DIR = 'image';
const DEFAULT_PICTURE_QUALITY = 10;

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private platform: Platform) { }

  async selectImage(quality = DEFAULT_PICTURE_QUALITY) {
    const image = await Camera.getPhoto({
      quality,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    const readFile = await this.readAsBase64(image);
    return readFile;
  }

  async takeImage(quality = DEFAULT_PICTURE_QUALITY) {
    const image = await Camera.getPhoto({
      quality,
      source: CameraSource.Camera,
      resultType: CameraResultType.Uri,
    });

    const readFile = await this.readAsBase64(image);
    return readFile;
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    if (!base64Data) { return }

    const fileName = new Date().getTime() + '.jpeg';
    await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data,
    });
  }

  async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      if (!photo.path) { return }
      const file = await Filesystem.readFile({
        path: photo.path,
      });
      return `data:image/${photo.format};base64,${file.data}`;
    }
    
    if (!photo.webPath) { return }
    const response = await fetch(photo.webPath);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
}
