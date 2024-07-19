import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeListComponent } from './components/college-list/college-list.component';
import { DeadlineDisplayComponent } from './components/deadline-display/deadline-display.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CollegeDetailsComponent } from './components/college-details/college-details.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MyCollegesComponent } from './components/my-colleges/my-colleges.component';

const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  {
    path: 'colleges',
    component: CollegeListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'colleges/:id', component: CollegeDetailsComponent },
  {
    path: 'deadlines/:programId',
    component: DeadlineDisplayComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'my-colleges', component: MyCollegesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
