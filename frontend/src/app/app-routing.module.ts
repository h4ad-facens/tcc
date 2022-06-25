import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'shoot', loadChildren: () => import('./pages/shoot/shoot.module').then(m => m.ShootModule) },
  { path: 'proposal', loadChildren: () => import('./pages/proposal/proposal.module').then(m => m.ProposalModule) },
  { path: 'proposal/create', loadChildren: () => import('./pages/create-proposal/create-proposal.module').then(m => m.CreateProposalModule) },
  { path: 'proposal/:id', loadChildren: () => import('./pages/proposal-detail/proposal-detail.module').then(m => m.ProposalDetailModule) },
  { path: 'proposal/:id/shoot', loadChildren: () => import('./pages/proposal-detail-shoot/proposal-detail-shoot.module').then(m => m.ProposalDetailShootModule) },
  { path: 'proposal/:id/accepted/freelancer', loadChildren: () => import('./pages/proposal-detail-freelancer/proposal-detail-freelancer.module').then(m => m.ProposalDetailFreelancerModule) },
  { path: 'proposal/:id/accepted/creator', loadChildren: () => import('./pages/proposal-detail-creator/proposal-detail-creator.module').then(m => m.ProposalDetailCreatorModule) },
  { path: 'proposal/:id/challenge/distribute', loadChildren: () => import('./pages/proposal-detail-challenge-distribute/proposal-detail-challenge-distribute.module').then(m => m.ProposalDetailChallengeDistributeModule) },
  { path: 'proposal/:id/challenge/claim', loadChildren: () => import('./pages/proposal-detail-challenge-claim/proposal-detail-challenge-claim.module').then(m => m.ProposalDetailChallengeClaimModule) },
  { path: 'proposal/:id/challenge', loadChildren: () => import('./pages/proposal-detail-challenge/proposal-detail-challenge.module').then(m => m.ProposalDetailChallengeModule) },
  { path: 'dispute', loadChildren: () => import('./pages/dispute/dispute.module').then(m => m.DisputeModule) },
  { path: 'help', loadChildren: () => import('./pages/help/help.module').then(m => m.HelpModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
