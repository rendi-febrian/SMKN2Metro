import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EStatusCode } from 'src/app/Interfaces/index.interface';
import { FormService } from 'src/app/Services/form/form.service';
import { GlobalService } from 'src/app/Services/global/global.service';
import { ModalService } from 'src/app/Services/modal/modal.service';
import { NavigationService } from 'src/app/Services/navigation/navigation.service';
import { RestService } from 'src/app/Services/rest/rest.service';
import { StorageService } from 'src/app/Services/storage/storage.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone : false
})
export class LoginPage implements OnInit {
  @ViewChild('modalLoginForm')
  modalLoginForm!: HTMLIonModalElement;

  form: FormGroup<{
    'email'   : FormControl<string | null>;
    'password': FormControl<string | null>;
  }> = new FormBuilder().group({
    email   : ['', [Validators.required]],
    password: ['', [Validators.required]],
  })

  error = {
    email   : { label: 'Username / Email', msg: '' },
    password: { label: 'Password', msg: '' },
  }

  isBusy           : boolean = false;
  isCreatingSession: boolean = false;

  passwordType: 'password' | 'text' = 'password';

  envi = environment

  constructor(
    private modalService     : ModalService,
    private formService      : FormService,
    private globalService    : GlobalService,
    private restService      : RestService,
    private storageService   : StorageService,
    private navigationService: NavigationService,
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.globalService.dynamicStatusBar('primary');
  }

  async ionViewDidEnter() {
    try {
      this.isBusy = true;
      
      await this.storageService.reStorage('user');
      await this.storageService.reStorage('wali');
      await this.storageService.reStorage('siswa');
      await this.storageService.reStorage('token');

      if (this.storageService.wali) {
        this.navigationService.toParentDashboardPage();
      } else if (this.storageService.token) {
        this.navigationService.toStudentDashboardPage();
      }
    } finally {
      this.isBusy = false;
    }

    this.modalLoginForm.present()
  }

  ionViewDidLeave() {
    this.form.reset();
  }

  showLoginForm() {
    this.modalService.setModalInstances('modalLoginForm', this.modalLoginForm);
    this.modalService.openModal('modalLoginForm');
  }

  onInputChange(field: 'email' | 'password' ) {
    this.error[field].msg = '';
  }

  async submitFormLogin() {
    if (this.form.invalid) {
      this.formService.validateForm(this.form, this.error);
      const toastMsg = this.formService.getFirstError(this.error);
      this.globalService.showToast(toastMsg, 'danger', 2000);
      return;
    }

    try {
      this.isCreatingSession = true;

      const form = {
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      }

      const response = await this.restService.login(form)
      console.log(response);
      
      if (response.status !== EStatusCode.SUCCESS) {
        throw response;
      };

      this.globalService.setSession();
      this.globalService.showToast(response.msg, 'success', 200);

      if(response['data']['data_wali']) {
        await this.storageService.storeStorage('wali', response['data']['data_wali']);
        await this.storageService.storeStorage('siswa', response['data']['data_siswa']);
        this.navigationService.toParentDashboardPage()
        this.modalLoginForm.dismiss();
        return;
      }
      await this.storageService.storeStorage('token', response['data']['users']['api_token']);
      await this.storageService.storeStorage('user', response['data']['users']);
      await this.storageService.storeStorage('siswa', response['data']['siswa']);
      this.navigationService.toStudentDashboardPage();
      this.modalLoginForm.dismiss();
    } catch (error: any) {
      if (error?.status === EStatusCode.VALIDATION_ERROR) {
        this.formService.serverErrorValidate(error.errors, this.error);
        const toastMsg = this.formService.getFirstError(this.error);
        this.globalService.showToast(toastMsg, 'danger', 2000);
      }
      this.globalService.errorHandler(error, 'Gagal membuat session');
    } finally {
      this.isCreatingSession = false;
    }
  }

  togglePasswordType() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      return;
    }
    this.passwordType = 'password';
  }

}
