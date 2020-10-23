import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MiningSiteComponent } from './components/mining-site/mining-site.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
  { path: 'profile', component: UserProfileComponent },
  { path: '', component: HomeComponent },
  { path: 'threejs', component: MiningSiteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
