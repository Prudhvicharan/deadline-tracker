import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { CollegeListComponent } from './components/college-list/college-list.component';
import { ProgramListComponent } from './components/program-list/program-list.component';
import { DeadlineDisplayComponent } from './components/deadline-display/deadline-display.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CollegeDetailsComponent } from './components/college-details/college-details.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  {
    path: 'colleges',
    component: CollegeListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'colleges/:id', component: CollegeDetailsComponent },
  {
    path: 'programs/:collegeId',
    component: ProgramListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'deadlines/:programId',
    component: DeadlineDisplayComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
