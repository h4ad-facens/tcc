import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'bid', loadChildren: () => import('./pages/bid/bid.module').then(m => m.BidModule) },
  { path: 'proposal', loadChildren: () => import('./pages/proposal/proposal.module').then(m => m.ProposalModule) },
  { path: 'proposal/create', loadChildren: () => import('./pages/create-proposal/create-proposal.module').then(m => m.CreateProposalModule) },
  { path: 'proposal/:id', loadChildren: () => import('./pages/proposal-detail/proposal-detail.module').then(m => m.ProposalDetailModule) },
  { path: 'dispute', loadChildren: () => import('./pages/dispute/dispute.module').then(m => m.DisputeModule) },
  { path: 'help', loadChildren: () => import('./pages/help/help.module').then(m => m.HelpModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
