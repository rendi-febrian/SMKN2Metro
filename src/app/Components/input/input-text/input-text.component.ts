import { Component, forwardRef, OnInit, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  standalone : false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    }
  ]
})
export class InputTextComponent implements ControlValueAccessor, OnInit {
  @Input()
  type: 'password' | 'number' | 'text' | 'email' | 'tel' = 'text';

  @Input()
  label: string = 'Label';

  @Input()
  placeholder: string = '';

  @Input()
  isRequired: boolean = false;

  @Input()
  isError: boolean = false;

  public val: string = '';

  public onChange: any  = () => {};
  public onTouch: any  = () => {};

  constructor() { }

  ngOnInit() { }

  set value(val) {
    if (val === this.val) { return; }

    this.val = val;
    this.onChange(this.val);
    this.onTouch(this.val);
  }
  get value() {
    return this.val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(value: any): void {
    this.value = value;
  }
}
