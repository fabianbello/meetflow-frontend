import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingComponent } from './loading/loading.component';
import { UserComponent } from './user/user.component';
import { TaskComponent } from './task/task.component';
import { RememberComponent } from './remember/remember.component';
import 'hammerjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { MeetingMinuteComponent } from './meeting-minute/meeting-minute.component';
import { AltSidebarModule } from 'ng-alt-sidebar';
import { HomeComponent } from './home/home.component';

// PRODUCCION
const config: SocketIoConfig = { url: 'http://70.35.204.110:82', options: {} }; 

// SEVIDOR DIINF
/* const config: SocketIoConfig = { url: 'http://158.170.35.17:8080', options: {} };  */ 

// LOCAL
/* const config: SocketIoConfig = { url: 'http://localhost:82', options: {} }; */

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    UserComponent,
    TaskComponent,
    RememberComponent,
    HomeComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
   
    // Add components
    SocketIoModule.forRoot(config),

  ],
  exports: [TaskComponent],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
