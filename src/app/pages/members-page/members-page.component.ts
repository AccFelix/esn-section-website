import { isPlatformServer } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

import { IMainItem, MainService } from 'src/app/services/main.service';

@Component({
  selector: 'esn-members-page',
  templateUrl: './members-page.component.html',
  styleUrls: ['./../base.scss'],
})
export class MembersPageComponent implements OnInit {
  public readonly page: string = 'Members_page';
  public mainInfo: any;

  constructor(
    private title: Title,
    private mainService: MainService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: object,
  ) {}

  ngOnInit(): void {
    this.mainInfo = this.transferState.get(makeStateKey('mainInfo'), undefined);

    if (!this.mainInfo) {
      this.fetchMainInfo();
    } else {
      this.setTitle();
    }
  }

  async fetchMainInfo(): Promise<void> {
    this.mainInfo = await firstValueFrom(this.mainService.fetchMain()).then(
      (res: any) => res.data[0],
    );

    if (isPlatformServer(this.platformId)) {
      this.transferState.set<IMainItem>(
        makeStateKey('mainInfo'),
        this.mainInfo,
      );
    }
    this.setTitle();
  }

  private setTitle(): void {
    this.title.setTitle('For Members | ' + this.mainInfo.section_long_name);
  }
}
