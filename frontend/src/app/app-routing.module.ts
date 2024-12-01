import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollegeListComponent } from './components/college-list/college-list.component';
import { DeadlineDisplayComponent } from './components/deadline-display/deadline-display.component';
import { LoginComponent } from './components/login/login.component';
import { ProgramDetailsComponent } from './components/program-details/program-details.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserCollegesComponent } from './components/user-colleges/user-colleges.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'colleges',
    component: CollegeListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'colleges/:id', component: ProgramDetailsComponent },
  {
    path: 'deadlines/:programId',
    component: DeadlineDisplayComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'my-colleges', component: UserCollegesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
