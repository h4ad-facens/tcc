import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'shoot', loadChildren: () => import('./pages/shoot/shoot.module').then(m => m.ShootModule) },
  { path: 'proposal', loadChildren: () => import('./pages/proposal/proposal.module').then(m => m.ProposalModule) },
  { path: 'dispute', loadChildren: () => import('./pages/dispute/dispute.module').then(m => m.DisputeModule) },
  { path: 'help', loadChildren: () => import('./pages/help/help.module').then(m => m.HelpModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
