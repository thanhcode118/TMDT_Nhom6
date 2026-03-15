import { Routes } from '@angular/router';
import { HomeComponent } from '@/features/home/components/home.component';
import { CategoryComponent } from '@/features/catalog/components/category.component';
import { NewCollectionComponent } from '@/features/catalog/components/new-collection.component';
import { SearchResultsComponent } from '@/features/search/components/search-results.component';
import { CheckoutComponent } from '@/features/checkout/components/checkout.component';
import { LoginComponent } from '@/features/auth/components/login.component';
import { ContactComponent } from '@/features/contact/components/contact.component';
import { PoliciesComponent } from '@/features/policies/components/policies.component';
import { ProductDetailComponent } from '@/features/product/components/product-detail.component';
import { AdminDashboardComponent } from '@/features/admin/components/admin-dashboard.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'collections/:slug', component: CategoryComponent },
    { path: 'new-collection', component: NewCollectionComponent },
    { path: 'product/:id', component: ProductDetailComponent },
    { path: 'search', component: SearchResultsComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'login', component: LoginComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'policies', component: PoliciesComponent },
    { path: 'admin', component: AdminDashboardComponent },
    { path: '**', redirectTo: '' }
];
