import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { IconComponent } from './icon.component';
import { SearchFacade } from '@/features/search/data-access/search.facade';
import { CheckoutFacade } from '@/features/checkout/data-access/checkout.facade';
import { AuthFacade } from '@/features/auth/data-access/auth.facade';

interface SubItem {
  label: string;
  link?: string;
}

interface MenuColumn {
  title: string;
  items: SubItem[];
}

interface NavCategory {
  label: string;
  slug?: string;
  type: 'mega' | 'dropdown' | 'link';
  link?: string;
  columns?: MenuColumn[];
  featuredImage?: { src: string; caption: string };
  items?: SubItem[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClasses()' },
  template: `
    <!-- Top Bar with shimmer effect -->
    <div class="top-bar bg-black/40 backdrop-blur-sm text-white text-[11px] md:text-xs font-semibold py-1 text-center tracking-[0.12em] uppercase relative overflow-hidden transition-all duration-500"
         [class.max-h-0]="isScrolled()"
         [class.py-0]="isScrolled()"
         [class.opacity-0]="isScrolled()"
         [class.overflow-hidden]="true">
      <div class="top-bar-shimmer"></div>
      <span class="relative z-10">100% ORIGINAL PRODUCTS</span>
    </div>

    <!-- Main Navigation -->
    <nav class="header-main transition-all duration-500 hover:bg-white hover:shadow-md"
          [class.bg-transparent]="useTransparentHeader()"
          [class.bg-white]="!useTransparentHeader()"
          [class.shadow-md]="useSolidHeaderStyle()"
          [class.scrolled]="useSolidHeaderStyle()">
      <div class="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4 relative">
        
        <!-- Logo (hidden on scroll) -->
        <a href="#" (click)="goHome($event)" 
           class="logo-link flex items-center group flex-shrink-0 z-[101] transition-all duration-500"
           [class.opacity-0]="isScrolled()"
           [class.w-0]="isScrolled()"
           [class.overflow-hidden]="isScrolled()"
           [class.gap-0]="isScrolled()">
          <img src="/assets/images/logo.png" alt="BeeShop - Phụ Kiện Decor" class="logo-img h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105 drop-shadow-md mt-1">
        </a>

        <!-- Desktop Mega Menu (Center) -->
        <nav class="hidden xl:flex items-center h-full flex-1 justify-center">
          <ul class="flex items-center gap-0 h-full">
            @for (cat of navigationStructure; track cat.label) {
              <li class="nav-item group h-full flex items-center px-2 xl:px-2.5 2xl:px-3 cursor-pointer whitespace-nowrap" [class.relative]="cat.type === 'dropdown'" [class.static]="cat.type === 'mega'">
                
                <!-- Main Label with animated underline -->
                <a 
                  (click)="navigateTo(cat, $event)"
                  class="nav-link relative text-xs xl:text-[13px] 2xl:text-sm font-semibold text-white tracking-wide group-hover:text-honey transition-colors duration-300 py-4 cursor-pointer"
                >
                  {{ cat.label }}
                  <span class="nav-underline"></span>
                </a>

                <!-- MEGA MENU with staggered animation -->
                @if (cat.type === 'mega') {
                  <div class="mega-menu absolute top-full left-0 w-full bg-white shadow-2xl border-t-2 border-honey/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible rounded-b-2xl overflow-hidden z-[102]">
                    <div class="mega-menu-inner flex p-8 gap-8">
                      @for (col of cat.columns; track col.title; let colIdx = $index) {
                        <div class="mega-col flex-1 space-y-4" [style.--col-index]="colIdx">
                          <h4 class="mega-col-title font-bold text-black border-b-2 border-honey/20 pb-2 text-base flex items-center gap-2">
                            <span class="w-1.5 h-1.5 bg-honey rounded-full"></span>
                            {{ col.title }}
                          </h4>
                          <ul class="space-y-1">
                            @for (item of col.items; track item.label; let itemIdx = $index) {
                              <li [style.--item-index]="itemIdx">
                                <a (click)="navigateToSub(cat, item, $event)" class="mega-item text-sm text-gray-700 hover:text-honey transition-all duration-300 block py-1.5 pl-3 border-l-2 border-transparent hover:border-honey hover:pl-4 hover:bg-honey/5 rounded-r cursor-pointer">
                                  {{ item.label }}
                                </a>
                              </li>
                            }
                          </ul>
                        </div>
                      }
                      
                      @if (cat.featuredImage) {
                        <div class="mega-featured w-1/4 relative rounded-xl overflow-hidden group/img aspect-[4/3] shadow-lg">
                          <img [src]="cat.featuredImage.src" class="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover/img:scale-110">
                          <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover/img:from-black/40 transition-all duration-500 flex items-end p-5">
                            <span class="featured-caption bg-white/90 backdrop-blur-sm px-4 py-2.5 text-charcoal font-bold text-sm shadow-xl rounded-lg flex items-center gap-2">
                              {{ cat.featuredImage.caption }}
                              <svg class="w-4 h-4 text-honey transition-transform duration-300 group-hover/img:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                            </span>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }

                <!-- DROPDOWN MENU with staggered items -->
                @if (cat.type === 'dropdown') {
                  <div class="dropdown-menu absolute top-full left-0 w-64 bg-white shadow-2xl border-t-2 border-honey/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible rounded-b-xl overflow-hidden z-[102]">
                    <ul class="py-1">
                      @for (item of cat.items; track item.label; let i = $index) {
                        <li [style.--item-index]="i">
                          <a (click)="navigateToSub(cat, item, $event)" class="dropdown-item flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-800 hover:text-honey hover:bg-honey/5 transition-all duration-300 border-l-3 border-transparent hover:border-honey cursor-pointer">
                            <span class="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-honey transition-colors duration-300"></span>
                            {{ item.label }}
                          </a>
                        </li>
                      }
                    </ul>
                  </div>
                }

              </li>
            }
          </ul>
        </nav>

        <!-- Search & Actions (Right) -->
        <div class="flex items-center gap-3 flex-shrink-0 z-[101]">
          
          <!-- Live Search Bar with glow -->
          <div class="relative group hidden lg:block w-[200px] xl:w-[220px] transition-all duration-500 ease-out focus-within:w-[280px]">
            <div class="search-bar flex items-center bg-white/15 border border-white/20 rounded-full px-4 py-2 focus-within:border-honey focus-within:ring-2 focus-within:ring-honey/30 focus-within:bg-white/90 focus-within:shadow-lg focus-within:shadow-honey/10 transition-all duration-500">
               <app-icon name="search" class="search-icon w-4 h-4 text-white/70 transition-colors duration-300 group-focus-within:text-honey"></app-icon>
               <input 
                 type="text" 
                 [value]="searchFacade.query()"
                 (input)="onSearchInput($event)"
                 (focus)="onSearchFocus()"
                 (blur)="onSearchBlur()"
                 (keydown.enter)="onSearchEnter()"
                 placeholder="Tìm sản phẩm..." 
                 class="search-input bg-transparent border-none outline-none text-sm w-full ml-2 text-white placeholder-white/50 focus:text-charcoal focus:placeholder-gray-400"
               >
               @if (searchFacade.query()) {
                 <button (click)="clearSearch()" class="text-gray-400 hover:text-red-500 hover:rotate-90 transition-all duration-300">
                   <app-icon name="close" class="w-4 h-4"></app-icon>
                 </button>
               }
            </div>
            
            @if (isSearchFocused() && (searchFacade.keywordSuggestions().length > 0 || (searchFacade.query() && searchFacade.suggestions().length > 0))) {
              <div class="absolute top-full right-0 mt-2 w-[350px] bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[102] animate-dropdown origin-top-right">
                @if (searchFacade.keywordSuggestions().length > 0) {
                  <div class="px-3 pt-3 pb-2 border-b border-gray-100">
                    <p class="text-[11px] font-semibold tracking-wide uppercase text-gray-500 mb-2">Gợi ý từ khóa</p>
                    <div class="flex flex-wrap gap-2">
                      @for (keyword of searchFacade.keywordSuggestions(); track keyword) {
                        <button
                          (click)="selectKeyword(keyword)"
                          class="text-xs px-2.5 py-1.5 rounded-full bg-cream text-charcoal hover:bg-honey hover:text-charcoal transition-colors"
                        >
                          {{ keyword }}
                        </button>
                      }
                    </div>
                  </div>
                }

                @if (searchFacade.query() && searchFacade.suggestions().length > 0) {
                  @for (product of searchFacade.suggestions(); track product.id) {
                    <div (click)="selectProduct(product)" class="flex items-center gap-3 p-3 hover:bg-cream cursor-pointer transition-all duration-300 border-b border-gray-50 last:border-0 hover:pl-5">
                      <img [src]="product.image" class="w-10 h-10 object-cover rounded-lg bg-gray-100 shadow-sm transition-transform duration-300 hover:scale-110">
                      <div class="flex-grow min-w-0">
                        <h4 class="text-sm font-bold text-charcoal truncate">{{ product.name }}</h4>
                        <p class="text-xs text-honey font-bold">{{ product.price | currency:'VND':'symbol':'1.0-0' }}</p>
                      </div>
                    </div>
                  }
                }

                <div (click)="onSearchEnter()" class="p-3 bg-gradient-to-r from-honey/10 to-honey/5 text-center cursor-pointer hover:from-honey hover:to-honey-light hover:text-white transition-all duration-500 group/cta">
                  <span class="text-sm font-bold text-honey group-hover/cta:text-white transition-colors">Xem tất cả kết quả →</span>
                </div>
              </div>
            }
          </div>
          
          <div class="relative hidden sm:block">
            <button (click)="toggleUserMenu()" class="action-btn header-icon text-white hover:text-honey transition-all duration-300">
              <app-icon name="user" class="w-6 h-6"></app-icon>
            </button>
            @if (userMenuOpen()) {
              <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[110] animate-dropdown origin-top-right">
                @if (authFacade.isAuthenticated()) {
                  <div class="px-4 py-3 border-b border-gray-100 bg-cream">
                    <p class="text-sm font-bold text-charcoal truncate">{{ authFacade.currentUser()?.fullName }}</p>
                    <p class="text-xs text-gray-500">{{ authFacade.currentUser()?.email }}</p>
                  </div>
                  @if (authFacade.isAdmin()) {
                    <a (click)="goToAdmin()" class="flex items-center gap-2 px-4 py-3 text-sm text-charcoal hover:bg-honey/10 hover:text-honey cursor-pointer transition-colors">
                      <app-icon name="grid" class="w-4 h-4"></app-icon> Trang quản trị
                    </a>
                  }
                  <button (click)="doLogout()" class="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors">
                    <app-icon name="close" class="w-4 h-4"></app-icon> Đăng xuất
                  </button>
                } @else {
                  <a (click)="goToLogin()" class="flex items-center gap-2 px-4 py-3 text-sm text-charcoal hover:bg-honey/10 hover:text-honey cursor-pointer transition-colors">
                    <app-icon name="user" class="w-4 h-4"></app-icon> Đăng nhập
                  </a>
                }
              </div>
            }
          </div>
          
          <button (click)="goToCheckout()" class="action-btn header-icon text-white hover:text-honey transition-all duration-300 relative">
            <app-icon name="shopping-bag" class="w-6 h-6"></app-icon>
            @if (checkoutFacade.cartCount() > 0) {
              <span class="cart-badge absolute -top-1.5 -right-1.5 w-5 h-5 bg-honey text-charcoal text-[10px] font-bold flex items-center justify-center rounded-full">
                {{ checkoutFacade.cartCount() }}
              </span>
            }
          </button>
          
          <button class="xl:hidden header-icon text-white action-btn hover:text-honey transition-all duration-300">
             <app-icon name="list" class="w-6 h-6"></app-icon>
          </button>
        </div>

      </div>
    </nav>
  `,
  styles: [`
    /* ═══════════════════════════════════════════ */
    /* TOP BAR SHIMMER                            */
    /* ═══════════════════════════════════════════ */
    .top-bar {
      position: relative;
    }
    .top-bar-shimmer {
      position: absolute;
      top: 0; left: -100%; width: 100%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 4s ease-in-out infinite;
    }
    @keyframes shimmer {
      0% { left: -100%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }

    /* ═══════════════════════════════════════════ */
    /* LOGO ANIMATIONS                            */
    /* ═══════════════════════════════════════════ */
    .logo-icon {
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
    }
    .logo-link:hover .logo-icon {
      transform: scale(1.15) rotate(-5deg);
      box-shadow: 0 4px 20px rgba(246, 195, 36, 0.4);
    }

    /* ═══════════════════════════════════════════ */
    /* NAV LINK ANIMATED UNDERLINE                */
    /* ═══════════════════════════════════════════ */
    .nav-link {
      position: relative;
      overflow: hidden;
    }
    .nav-underline {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2.5px;
      background: linear-gradient(90deg, #F6C324, #FDD86D);
      border-radius: 2px;
      transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .nav-item:hover .nav-underline {
      width: 100%;
      left: 0;
    }

    /* ═══════════════════════════════════════════ */
    /* MEGA MENU ENTRANCE                         */
    /* ═══════════════════════════════════════════ */
    .mega-menu {
      transform: translateY(12px) scaleY(0.95);
      transform-origin: top center;
      transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                  visibility 0.35s,
                  transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nav-item:hover .mega-menu {
      transform: translateY(0) scaleY(1);
    }

    /* Staggered column entrance */
    .mega-col {
      opacity: 0;
      transform: translateY(15px);
      transition: opacity 0.4s ease, transform 0.4s ease;
      transition-delay: calc(var(--col-index, 0) * 0.08s + 0.1s);
    }
    .nav-item:hover .mega-col {
      opacity: 1;
      transform: translateY(0);
    }

    /* Featured image entrance */
    .mega-featured {
      opacity: 0;
      transform: translateX(20px);
      transition: opacity 0.5s ease 0.25s, transform 0.5s ease 0.25s;
    }
    .nav-item:hover .mega-featured {
      opacity: 1;
      transform: translateX(0);
    }

    /* Column title animation */
    .mega-col-title {
      opacity: 0;
      transform: translateX(-10px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      transition-delay: calc(var(--col-index, 0) * 0.08s + 0.15s);
    }
    .nav-item:hover .mega-col-title {
      opacity: 1;
      transform: translateX(0);
    }

    /* Mega menu sub-item hover */
    .mega-item {
      position: relative;
    }
    .mega-item::before {
      content: '›';
      position: absolute;
      left: 0;
      opacity: 0;
      color: #F6C324;
      font-weight: bold;
      transition: opacity 0.2s, transform 0.2s;
      transform: translateX(-5px);
    }
    .mega-item:hover::before {
      opacity: 1;
      transform: translateX(0);
    }

    /* ═══════════════════════════════════════════ */
    /* DROPDOWN MENU ENTRANCE                     */
    /* ═══════════════════════════════════════════ */
    .dropdown-menu {
      transform: translateY(10px) scale(0.97);
      transform-origin: top left;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                  visibility 0.3s,
                  transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nav-item:hover .dropdown-menu {
      transform: translateY(0) scale(1);
    }

    /* Staggered dropdown items */
    .dropdown-item {
      opacity: 0;
      transform: translateX(-8px);
      transition: opacity 0.25s ease, transform 0.25s ease,
                  background-color 0.3s, color 0.3s, padding-left 0.3s, border-color 0.3s;
      transition-delay: calc(var(--item-index, 0) * 0.04s + 0.1s);
    }
    .nav-item:hover .dropdown-item {
      opacity: 1;
      transform: translateX(0);
    }

    /* ═══════════════════════════════════════════ */
    /* SEARCH BAR ANIMATIONS                      */
    /* ═══════════════════════════════════════════ */
    .search-bar {
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .search-bar:focus-within {
      background: white;
    }

    /* ═══════════════════════════════════════════ */
    /* ACTION BUTTON HOVER                        */
    /* ═══════════════════════════════════════════ */
    .action-btn {
      position: relative;
      transition: color 0.3s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .action-btn:hover {
      transform: scale(1.15);
    }
    .action-btn:active {
      transform: scale(0.92);
    }

    /* Cart badge pulse */
    .cart-badge {
      animation: badgePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 2px 8px rgba(246, 195, 36, 0.4);
    }
    @keyframes badgePop {
      0% { transform: scale(0); }
      60% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }

    /* ═══════════════════════════════════════════ */
    /* GENERIC ANIMATIONS                         */
    /* ═══════════════════════════════════════════ */
    .animate-dropdown {
      animation: dropdownIn 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    @keyframes dropdownIn {
      from { opacity: 0; transform: translateY(-8px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Smooth header shadow on scroll (optional enhancement) */
    .header-main {
      transition: background-color 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
    }
    .header-main:not(.scrolled):not(:hover) {
      background-color: transparent !important;
      box-shadow: none;
    }
    .header-main:hover,
    .header-main.scrolled {
      background-color: #fff;
    }

    /* ═══════════════════════════════════════════ */
    /* HEADER HOVER: WHITE BG + DARK TEXT         */
    /* ═══════════════════════════════════════════ */
    .header-main:hover .nav-link {
      color: #111;
    }
    .header-main:hover .nav-link:hover {
      color: #F6C324;
    }
    .header-main:hover .logo-text {
      color: #111;
    }
    .header-main:hover .logo-sub {
      color: #888;
    }
    .header-main:hover .header-icon {
      color: #333;
    }
    .header-main:hover .header-icon:hover {
      color: #F6C324;
    }
    .header-main:hover .search-bar {
      background: rgba(245, 245, 245, 1);
      border-color: #e5e5e5;
    }
    .header-main:hover .search-input {
      color: #333;
    }
    .header-main:hover .search-input::placeholder {
      color: #999;
    }
    .header-main:hover .search-icon {
      color: #999;
    }

    /* ═══════════════════════════════════════════ */
    /* SCROLLED STATE (same as hover)             */
    /* ═══════════════════════════════════════════ */
    .header-main.scrolled .nav-link {
      color: #111;
    }
    .header-main.scrolled .nav-link:hover {
      color: #F6C324;
    }
    .header-main.scrolled .logo-text {
      color: #111;
    }
    .header-main.scrolled .logo-sub {
      color: #888;
    }
    .header-main.scrolled .header-icon {
      color: #333;
    }
    .header-main.scrolled .header-icon:hover {
      color: #F6C324;
    }
    .header-main.scrolled .search-bar {
      background: rgba(245, 245, 245, 1);
      border-color: #e5e5e5;
    }
    .header-main.scrolled .search-input {
      color: #333;
    }
    .header-main.scrolled .search-input::placeholder {
      color: #999;
    }
    .header-main.scrolled .search-icon {
      color: #999;
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchFacade = inject(SearchFacade);
  checkoutFacade = inject(CheckoutFacade);
  private router = inject(Router);
  isScrolled = signal(false);
  isHomeRoute = signal(true);
  private scrollCleanup: (() => void) | null = null;
  private routeCleanup: (() => void) | null = null;
  private searchBlurTimer: ReturnType<typeof setTimeout> | null = null;
  isSearchFocused = signal(false);

  hostClasses = () => {
    return this.useSolidHeaderStyle()
      ? 'block fixed top-0 left-0 right-0 z-[100]'
      : 'block absolute top-0 left-0 right-0 z-[100]';
  };

  useTransparentHeader = () => this.isHomeRoute() && !this.isScrolled();
  useSolidHeaderStyle = () => !this.isHomeRoute() || this.isScrolled();

  private updateRouteState() {
    const currentPath = this.router.url.split('?')[0];
    this.isHomeRoute.set(currentPath === '' || currentPath === '/' || currentPath === '/home');
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    this.updateRouteState();
    const routeSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateRouteState();
      }
    });
    this.routeCleanup = () => routeSub.unsubscribe();

    if (isPlatformBrowser(this.platformId)) {
      const onScroll = () => {
        this.isScrolled.set(window.scrollY > 50);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      this.scrollCleanup = () => window.removeEventListener('scroll', onScroll);
    }
  }

  ngOnDestroy() {
    this.scrollCleanup?.();
    this.routeCleanup?.();
    if (this.searchBlurTimer) {
      clearTimeout(this.searchBlurTimer);
    }
  }

  // Full Navigation Data Structure
  navigationStructure: NavCategory[] = [
    {
      label: 'Trang trí nội thất',
      slug: 'interior-decoration',
      type: 'mega',
      columns: [
        {
          title: 'Đồ trang trí tường',
          items: [
            { label: 'Tranh Canvas & Poster' },
            { label: 'Gương trang trí' },
            { label: 'Đồng hồ treo tường' },
            { label: 'Macrame & Đồ đan lát' }
          ]
        },
        {
          title: 'Đồ trang trí mềm',
          items: [
            { label: 'Thảm trải sàn' },
            { label: 'Vỏ gối tựa sofa' },
            { label: 'Rèm cửa & Vải decor' }
          ]
        },
        {
          title: 'Phụ kiện điểm nhấn',
          items: [
            { label: 'Lọ hoa & Chậu cây mini' },
            { label: 'Tượng & Đồ thủ công' },
            { label: 'Khay đựng đồ đan mây' }
          ]
        }
      ],
      featuredImage: {
        src: 'https://picsum.photos/id/1078/400/300',
        caption: 'Góc phòng khách ấm áp'
      }
    },
    {
      label: 'Bếp & Bàn ăn',
      slug: 'kitchen-dining',
      type: 'mega',
      columns: [
        {
          title: 'Cốc & Ly',
          items: [
            { label: 'Cốc gốm nặn tay' },
            { label: 'Ly thủy tinh kiểu cách' },
            { label: 'Set ấm trà' }
          ]
        },
        {
          title: 'Đồ dùng bàn ăn',
          items: [
            { label: 'Đĩa/Bát gốm sứ' },
            { label: 'Thìa, nĩa gỗ/vàng đồng' },
            { label: 'Khay gỗ decor thức ăn' }
          ]
        },
        {
          title: 'Phụ kiện vải',
          items: [
            { label: 'Khăn trải bàn vintage' },
            { label: 'Tấm lót nồi & Lót ly' },
            { label: 'Tạp dề linen' }
          ]
        }
      ],
      featuredImage: {
        src: 'https://picsum.photos/id/425/400/300',
        caption: 'Bữa ăn ngon hơn'
      }
    },
    {
      label: 'Đèn & Ánh sáng',
      slug: 'lighting',
      type: 'mega',
      columns: [
        {
          title: 'Loại đèn',
          items: [
            { label: 'Đèn ngủ & Đèn để bàn' },
            { label: 'Đèn cây đứng (Floor lamps)' },
            { label: 'Dây đèn LED trang trí' },
            { label: 'Đèn hoàng hôn' }
          ]
        },
        {
          title: 'Hương thơm',
          items: [
            { label: 'Nến thơm tạo hình' },
            { label: 'Sáp thơm & Tinh dầu' },
            { label: 'Đế lót nến nghệ thuật' }
          ]
        }
      ],
      featuredImage: {
        src: 'https://picsum.photos/id/366/400/300',
        caption: 'Ánh sáng cực chill'
      }
    },
    {
      label: 'Quà tặng',
      slug: 'gifts',
      type: 'dropdown',
      items: [
        { label: 'Dưới 200k' },
        { label: '200k - 500k' },
        { label: 'Trên 500k' },
        { label: 'Quà tặng Tân gia' },
        { label: 'Quà sinh nhật cho Nàng / Cho Chàng' },
        { label: 'Set quà gói sẵn (Gift sets)' },
        { label: 'Thẻ quà tặng (E-Voucher)' }
      ]
    },
    {
      label: 'Thương hiệu',
      slug: 'brands',
      type: 'dropdown',
      items: [
        { label: 'Gốm Bát Tràng' },
        { label: 'Thơm Studio' },
        { label: 'Lạc Macrame' },
        { label: 'Mây Tre Đan' }
      ]
    },
    {
      label: 'Nhà thiết kế',
      slug: 'designers',
      type: 'dropdown',
      items: [
        { label: 'BST "Thu Cúc" x Họa sĩ A' },
        { label: 'BST "Mùa Yêu" x Designer B' }
      ]
    },
    {
      label: 'Blog',
      slug: 'blog',
      type: 'dropdown',
      items: [
        { label: 'Mẹo trang trí nhà cửa' },
        { label: 'Xu hướng không gian sống' },
        { label: 'Chuyện nhà Bee' },
        { label: 'Video & Lookbook' }
      ]
    },
    {
      label: 'B2B',
      slug: 'b2b',
      type: 'dropdown',
      items: [
        { label: 'Chính sách mua sỉ (Đại lý)' },
        { label: 'Quà tặng sự kiện / Quà tặng nhân viên' },
        { label: 'Đăng ký báo giá doanh nghiệp' },
        { label: 'Dự án đã thực hiện (Portfolio)' }
      ]
    }
  ];

  navigateTo(cat: NavCategory, event: Event) {
    event.preventDefault();
    if (cat.slug) {
      this.router.navigate(['/collections', cat.slug]);
    } else if (cat.link === 'home') {
      this.router.navigate(['/']);
    } else if (cat.link === 'new-collection') {
      this.router.navigate(['/new-collection']);
    } else if (cat.slug) {
      this.router.navigate(['/collections', cat.slug]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navigateToSub(cat: NavCategory, item: SubItem, event: Event) {
    event.preventDefault();
    // Navigate to the parent category for now
    if (cat.slug) {
      this.router.navigate(['/collections', cat.slug]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['/']);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchFacade.setQuery(value);
  }

  onSearchFocus() {
    if (this.searchBlurTimer) {
      clearTimeout(this.searchBlurTimer);
      this.searchBlurTimer = null;
    }
    this.isSearchFocused.set(true);
  }

  onSearchBlur() {
    this.searchBlurTimer = setTimeout(() => {
      this.isSearchFocused.set(false);
    }, 150);
  }

  onSearchEnter() {
    const query = this.searchFacade.query();
    if (query) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }

  clearSearch() {
    this.searchFacade.clearQuery();
  }

  selectProduct(product: any) {
    this.searchFacade.setQuery(product.name);
    this.isSearchFocused.set(false);
    this.router.navigate(['/search'], { queryParams: { q: product.name } });
  }

  selectKeyword(keyword: string) {
    this.searchFacade.applySuggestedKeyword(keyword);
    this.isSearchFocused.set(false);
    this.router.navigate(['/search'], { queryParams: { q: keyword } });
  }

  // === User Menu ===
  authFacade = inject(AuthFacade);
  userMenuOpen = signal(false);

  toggleUserMenu() {
    this.userMenuOpen.update(v => !v);
  }

  goToLogin() {
    this.userMenuOpen.set(false);
    this.router.navigate(['/login']);
  }

  goToAdmin() {
    this.userMenuOpen.set(false);
    this.router.navigate(['/admin']);
  }

  doLogout() {
    this.authFacade.logout();
    this.userMenuOpen.set(false);
    this.router.navigate(['/']);
  }

  goToCheckout() {
    this.userMenuOpen.set(false);
    this.router.navigate(['/checkout']);
  }
}
