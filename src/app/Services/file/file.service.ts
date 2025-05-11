import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { GetUriResult, Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Http, HttpDownloadFileResult } from '@capacitor-community/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private platform: Platform,
    private fileOpener: FileOpener,
    private fileTransfer: FileTransfer,
    private http: HttpClient,
  ) { }

  generateElearningPdfFilename(uuid: string) {
    return `elearning-${uuid}.pdf`;
  }

  generateReportPdfFilename(title: string) {
    return `report-${title}.pdf`;
  }

  getFilepath(name: string): Promise<GetUriResult> {
    return Filesystem.getUri({
      directory: Directory.Documents,
      path     : name,
    });
  }

  async getIsFileExist(name: string): Promise<boolean> {
    try {
      await Filesystem.requestPermissions();
      await Filesystem.stat({
        directory: Directory.Documents,
        path     : name,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getElearningFilepath(name: string): Promise<string> {
    const receiptFilepath = await this.getFilepath(name);
    return receiptFilepath.uri;
  }

  async saveElearningFilepath(name: string, file: string) : Promise<string> {
    try {
      const savedFile = await Filesystem.writeFile({
        directory: Directory.Documents,
        path     : name,
        data     : `data:application/pdf;base64,${file}`,
      });
      return savedFile.uri;
    } catch (error) {
      return ''
    }
  }


  async downloadReportFile(report_name: string, url: string) {
    let filepath = '';
    const filename = this.generateReportPdfFilename(report_name);

    const isFileAlreadyExist = await this.getIsFileExist(filename);
    if (!isFileAlreadyExist) {
      filepath = await this.downloadFile(url, filename);
      await this.previewFile(filepath);
      return;
    }

    filepath = await this.getReportFilepath(filename);
    this.previewFile(filepath);
  }

  async getReportFilepath(name: string): Promise<string> {
    const receiptFilepath = await this.getFilepath(name);
    return receiptFilepath.uri;
  }

  async saveReportFilepath(name: string, file: string) : Promise<string> {
    try {
      const savedFile = await Filesystem.writeFile({
        directory: Directory.Documents,
        path     : name,
        data     : `data:application/pdf;base64,${file}`,
      });
      return savedFile.uri;
    } catch (error) {
      return ''
    }
  }

  async downloadFile(url: string, filename: string) {
    await Filesystem.requestPermissions();

    const response = await Filesystem.downloadFile({
      url: url,
      path: filename,
      directory: Directory.Documents,
    });

    return response.path!;
  };

  previewFile(path: string): Promise<void> {
    return this.fileOpener.open(path, 'application/pdf')
  }
}
