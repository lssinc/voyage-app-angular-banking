import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VerificationService } from './verification.service';
import { Verification } from './verification.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  verificationForm: FormGroup;
  codeSent = false;
  verificationFailed = false;

  constructor(
    private formBuilder: FormBuilder,
    private verificationService: VerificationService,
    @Inject('Window') private window: any) { }

  ngOnInit() {
    this.initializeForm();
  }

  sendCode(): void {
    this.verificationService.sendCode()
      .subscribe(result => {
        this.codeSent = true;
      });
  }

  verify(): boolean {
    if (this.verificationForm.invalid) {
      return;
    }

    const verification = this.verificationForm.value as Verification;
    this.verificationService.verify(verification)
      .subscribe(result => {
        this.window.location.href = `${environment.APP_HOME}`;
      }, () => {
        this.verificationFailed = true;
      });
  }

  private initializeForm(): void {
    this.verificationForm = this.formBuilder.group({
      code: ['', Validators.required]
    });
  }
}
