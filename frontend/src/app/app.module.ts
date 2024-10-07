import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule


import { CollegeListComponent } from './components/college-list/college-list.component';
import { DeadlineDisplayComponent } from './components/deadline-display/deadline-display.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CollegeDetailsComponent } from './components/college-details/college-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserCollegesComponent } from './components/user-colleges/user-colleges.component';

@NgModule({
  declarations: [
    AppComponent,
    CollegeListComponent,
    DeadlineDisplayComponent,
    LoginComponent,
    RegisterComponent,
    CollegeDetailsComponent,
    DashboardComponent,
    UserCollegesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    HttpClientModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
