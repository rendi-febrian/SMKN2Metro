import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { StorageService } from '../storage/storage.service';

export enum ERoutePath {
  ROOT                = '/',
  LOGIN               = '/login',
  MAIN_DASHBOARD      = '/main/dashboard',
  MAIN_ELEARNING      = '/main/e-learning',
  MAIN_TEST           = '/main/test',
  MAIN_PROFILE        = '/main/profile',
  PARENT_DASHBOARD    = '/parent/dashboard',
  PARENT_ANNOUNCEMENT = '/parent/announcement',
  PARENT_SETTING      = '/parent/setting',
  ELEARNING_DETAIL    = '/e-learning/:uuid',
  PROFILE_CARD        = '/profile/card',
  TEST_DETAIL         = 'test/:uuid',
  TEST_SUBMITTED      = 'test/done',
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private urlHistories: string[] = [];
  private urlParamHistories: {
    state      : any,
    queryParams: any,
    replaceUrl : boolean
  }[] = [];

  constructor(
    private router        : Router,
    private storageService: StorageService,
  ) {
    const routeSubs: Subject<any> = new Subject<any>();

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntil(routeSubs)
    ).subscribe((route) => {
      if(!this.urlHistories.length) {
        this.urlHistories.push((route as NavigationEnd).url);
        this.urlParamHistories.push({
          state      : undefined,
          queryParams: undefined,
          replaceUrl : false,
        });

        routeSubs.next(true);
        routeSubs.complete();
      }
    });
  }

  toRootPage() {
    this.setRoot(ERoutePath.ROOT, undefined, undefined, true);
  }

  toLoginpage() {
    this.setRoot('login', undefined, undefined, true);
  }

  toDashboardPage() {
    const isParent = !!this.storageService.wali;
    if (isParent) {
      this.toParentDashboardPage();
      return;
    }
    this.toStudentDashboardPage();
  }

  toStudentDashboardPage() {
    this.setRoot(ERoutePath.MAIN_DASHBOARD, undefined, undefined, true);
  }
  toStudentElearningPage() {
    this.setMainRoot(ERoutePath.MAIN_ELEARNING, undefined, undefined, true)
  }
  toStudentTestPage() {
    this.setMainRoot(ERoutePath.MAIN_TEST, undefined, undefined, true)
  }
  toStudentProfilePage() {
    this.setMainRoot(ERoutePath.MAIN_PROFILE, undefined, undefined, true)
  }

  toStudentProfileCardPage() {
    this.push(ERoutePath.PROFILE_CARD, undefined, undefined, true);
  }

  toStudentTestDetailPage(testId: string) {
    this.push(ERoutePath.TEST_DETAIL, { uuid: testId }, undefined, true);
  }
  toStudentTestDonePage() {
    this.push(ERoutePath.TEST_SUBMITTED, undefined, undefined, true);
  }

  toElearningDetail(uuid: string) {
    this.push(ERoutePath.ELEARNING_DETAIL, { uuid }, undefined, false);
  }

  toParentDashboardPage() {
    this.setRoot(ERoutePath.PARENT_DASHBOARD, undefined, undefined, true);
  }

  /**
  * The navigated URL become previous page of the history.
  * If error occured, developer must provide navigate to any default route page.
  */
  pop() {
    this.urlHistories.pop();
    this.urlParamHistories.pop();

    if(this.urlHistories.length && this.urlParamHistories.length) {
      return new Promise((resolve, reject) => {
        this.router.navigate([this.urlHistories[this.urlHistories.length - 1]], {
          state      : this.urlParamHistories[this.urlParamHistories.length - 1].state,
          queryParams: this.urlParamHistories[this.urlParamHistories.length - 1].queryParams,
          replaceUrl : this.urlParamHistories[this.urlParamHistories.length - 1].replaceUrl,
        })
        .catch(() => reject(false));
      })
    }
    return this.toDashboardPage();
  }

  /** The specified URL become the root of navigation route.
  * @param urlTo URL expected.
  * @param stateParams State params.
  * @param queryParams Query params.
  */
  private setRoot(
    urlTo       : string,
    stateParams?: Record<string, string>,
    queryParams?: Record<string, string>,
    replaceUrl? : boolean
  ) {
    this.resetHistories()

    this.urlHistories.push(urlTo);
    this.urlParamHistories.push({
      state      : stateParams,
      queryParams: queryParams,
      replaceUrl : replaceUrl ?? false,
    });

    this.router.navigate([urlTo], {
      state      : stateParams,
      queryParams: queryParams,
      replaceUrl : replaceUrl,
    });
  }

  /**
  * The navigated URL become next page of the history.
  * @param urlTo URL expected.
  * @param stateParams State params.
  * @param queryParams Query params.
  */
  private push(
    urlTo       : string,
    stateParams?: Record<string, string>,
    queryParams?: Record<string, string>,
    replaceUrl? : boolean
  ) {
    if (stateParams) {
      urlTo = this.replaceParams(urlTo, stateParams);
    }
    
    this.urlHistories.push(urlTo);
    this.urlParamHistories.push({
      state      : stateParams,
      queryParams: queryParams,
      replaceUrl : replaceUrl ?? false,
    });

    // Navigate to expected URL
    return this.router.navigate([urlTo], {
      state: stateParams,
      queryParams: queryParams,
      replaceUrl: replaceUrl,
    })
  }

  private setMainRoot(
    urlTo       : string,
    stateParams?: Record<string, string>,
    queryParams?: Record<string, string>,
    replaceUrl? : boolean
  ) {
    this.resetHistories()

    this.urlHistories.push(ERoutePath.MAIN_DASHBOARD);
    this.urlHistories.push(urlTo);

    console.log(this.urlHistories)
    this.urlParamHistories.push({
      state      : stateParams,
      queryParams: queryParams,
      replaceUrl : replaceUrl ?? false,
    });

    this.router.navigate([urlTo], {
      state      : stateParams,
      queryParams: queryParams,
      replaceUrl : replaceUrl,
    });
  }

  private replaceParams(
    url: string,
    params: Record<string, string>
  ) {
    let replacedUrl = url;
    Object.keys(params).forEach((key) => {
      replacedUrl = replacedUrl.replace(`:${key}`, params[key]);
    });
    return replacedUrl;
  }

  private resetHistories() {
    this.urlHistories = [];
    this.urlParamHistories = [];
  }
}
