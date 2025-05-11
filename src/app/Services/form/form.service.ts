import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

type ErrorObj = Record<string, { label: string; msg: string }>;
type ErrorServer = Record<string, string>;


@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() {}

  fieldChange(field: AbstractControl, rootErr: ErrorObj, errorKey: string) {
    const arrayKey = errorKey.split('.');
    const key = arrayKey.pop() as string;

    let parentKey = arrayKey.join('.');
    const parentErr = this.getDeepObject(rootErr, parentKey)

    const keyErr = this.getDeepObject(rootErr, errorKey);

    if (field.invalid && field.touched) {
      const errorLabel = this.getDeepObject(rootErr, errorKey).label;
      const errorMessage = this.formatErrorMessage(errorLabel, field.errors);

      Object.defineProperty(parentErr, key, { value:  {...keyErr, msg: errorMessage }, writable: true });
    };

    if (field.valid) {
      Object.defineProperty(parentErr, key, { value:  {...keyErr, msg: '' }, writable: true });
    }
  };

  validateForm(form: FormGroup, rootErr: ErrorObj, iteration = 0, parentKey = '') {
    const { controls } = form;

    Object.keys(controls).forEach((key) => {
      if (controls[key].invalid && !(controls[key] instanceof FormGroup)) {
        let errorKey = key;
        if (parentKey) { errorKey = parentKey + '.' + key }

        const errorLabel = this.getDeepObject(rootErr, errorKey).label;
        const errorMessage = this.formatErrorMessage(errorLabel, controls[key].errors);

        const parentErr = this.getDeepObject(rootErr, parentKey)
        const keyErr = this.getDeepObject(rootErr, errorKey);
        Object.defineProperty(parentErr, key, { value:  {...keyErr, msg: errorMessage }, writable: true });
      };

      if (controls[key] instanceof FormGroup) {
        let nextKey = key;
        if (parentKey) { nextKey = parentKey + '.' + key};
        this.validateForm((controls[key] as FormGroup), rootErr, iteration + 1, nextKey)
      }
    });
  };

  resetForm(form: FormGroup, errors?: ErrorObj) {
    form.reset();

    if (!errors) { return; }
    Object.keys(errors).forEach((key) => {
      Object.defineProperty(errors, key, { value:  {...errors[key], msg: '' }, writable: true });
    });
  }

  getFirstError(errors: ErrorObj, prevError = ''): string {
    let errorMsg = '';

    if (prevError) { return prevError }
 
    Object.keys(errors).forEach((key) => {
      if (errorMsg) {
        return errorMsg;
      }
    
      if (errors[key]?.msg) {
        errorMsg = errors[key].msg;
        return errorMsg;
      }
      
      if ((<unknown>errors[key] as ErrorObj[]).length) {
        (<unknown>errors[key] as ErrorObj[]).forEach((_, index) => {
          errorMsg = this.getFirstError((((<unknown>errors[key] as ErrorObj[]))[index]) as ErrorObj, errorMsg);
          return errorMsg;
        })
      };

      return errorMsg
    });
  
    return errorMsg;
  }

  serverErrorValidate(errorServer: ErrorServer, errors: ErrorObj) {
    Object.keys(errorServer).forEach((key) => {
      const arrayKey = key.split('.');
      const fieldname = arrayKey.pop() as string;

      let parentKey = arrayKey.join('.');

      const parentErr = this.getDeepObject(errors, parentKey)
      const keyErr = this.getDeepObject(errors, key);
      
      Object.defineProperty(parentErr, fieldname, { value:  {...keyErr, msg: errorServer[key] }, writable: true });
    });
  }

  private formatErrorMessage(label: string, errors: ValidationErrors | null): string {
    if (!errors) { return ''; }

    if (errors['required']) {
        return `${label} perlu diisi`;
    } else if (errors['minLength']) {
        return `Max length is ${errors['minLength'].actualLength}/${errors['minLength'].requiredLength}`;
    } else if (errors['maxlength']) {
        return `Min length is ${errors['maxlength'].actualLength}/${errors['maxlength'].requiredLength}`;
    } else if (errors['email']) {
        return 'Email is not valid';
    } else if (errors['min']) {
        return `Min value is ${errors['min'].min}, actual value is ${errors['min'].actual}`;
    } else if (errors['max']) {
        return `Max value is ${errors['max'].max}, actual value is ${errors['max'].actual}`;
    } else if (errors['pattern']) {
        return `${label} belum memenuhi standar format`;
    } else if (errors['passwordMismatch']) {
        return 'Passwords do not match';
    } else if (errors['emailInUse']) {
        return 'There is an account with that email';
    } else if (errors['confirmUnmatch']) {
        return `Kolom konfirmasi tidak sesuai dengan kolom password`;
    } else {
        return '';
    }
  }

  private getDeepObject(obj: Record<any, any>, propString: string) {
    /** handle nested object with formatted key
     *  example: 'country_requirements.ktp.exp'
     *  will resulted in 'exp' key value inside
     *  'country_requirements' object
    */
    if (!propString) { return obj }
  
    var prop, props = propString.split('.');

    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
      prop = props[i];

      var candidate = obj[prop];
      if (candidate !== undefined) {
        obj = candidate;
      } else {
        break;
      }
    }
    return obj[props[i]];
  }
}
