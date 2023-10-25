import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
/* import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SidebarjsModule } from 'ng-sidebarjs';

import { LyTabsModule } from '@alyle/ui/tabs';
import { LyTypographyModule } from '@alyle/ui/typography';
import { LyButtonModule } from '@alyle/ui/button'; */
/* import 'hammerjs'; */

/* import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HAMMER_GESTURE_CONFIG, HammerModule } from '@angular/platform-browser';

import {
  LyTheme2,
  StyleRenderer,
  LY_THEME,
  LY_THEME_NAME,
  LyHammerGestureConfig,
} from '@alyle/ui';
import { LyToolbarModule } from '@alyle/ui/toolbar';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
 */
@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
/*     InfiniteScrollModule,
    SidebarjsModule.forRoot(),
    // Add components
    LyButtonModule,
    LyToolbarModule,
    LyImageCropperModule,
    // ...
    // Gestures
    HammerModule, */
    DragDropModule
    
  ],
  providers: [ ],
})
export class MainModule {}
