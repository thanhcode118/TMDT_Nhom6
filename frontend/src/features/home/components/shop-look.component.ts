import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopLook } from '@/core/models';
import { HomeFacade } from '@/features/home/data-access/home.facade';
import { IconComponent } from '@/shared/components/icon.component';

@Component({
  selector: 'app-shop-look',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-20 bg-cream">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-charcoal text-center mb-2">Shop The Look</h2>
        <p class="text-center text-gray-500 mb-10">Mua cả không gian sống với gợi ý từ BeeShop</p>

        <!-- Room Selector Tabs -->
        <div class="flex flex-wrap justify-center gap-4 mb-12">
          @for (look of homeFacade.shopLooks(); track look.id) {
            <button
              (click)="selectLook(look)"
              class="px-6 py-2 rounded-full border-2 font-bold transition-all duration-300"
              [class.bg-honey]="selectedLook().id === look.id"
              [class.border-honey]="selectedLook().id === look.id"
              [class.text-charcoal]="selectedLook().id === look.id"
              [class.bg-transparent]="selectedLook().id !== look.id"
              [class.border-gray-300]="selectedLook().id !== look.id"
              [class.text-gray-500]="selectedLook().id !== look.id"
              [class.hover:border-honey]="selectedLook().id !== look.id"
            >
              {{ look.name }}
            </button>
          }
        </div>

        <!-- Animated Content Container -->
        <div class="animate-fade-in-up">
          <div class="grid lg:grid-cols-3 gap-8 items-start">
            
            <!-- Big Interactive Image -->
            <div class="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-xl group">
              <!-- Using @for loop with a single item to force DOM re-creation and trigger CSS animation when ID changes -->
              @for (look of [selectedLook()]; track look.id) {
                <img 
                  [src]="look.image" 
                  class="w-full h-auto object-cover animate-zoom-in" 
                  [alt]="look.name"
                >
              }
              
              <!-- Hotspots -->
              @for (spot of selectedLook().hotspots; track spot.id) {
                <div 
                  class="absolute" 
                  [style.top.%]="spot.y" 
                  [style.left.%]="spot.x"
                >
                  <!-- Pulse Effect -->
                  <div class="absolute -inset-2 bg-honey/50 rounded-full animate-ping"></div>
                  
                  <!-- Button -->
                  <button 
                    (click)="toggleHotspot(spot.id)"
                    class="relative w-8 h-8 bg-white text-honey rounded-full shadow-lg flex items-center justify-center hover:bg-honey hover:text-white transition-colors z-10"
                  >
                    <app-icon name="plus" class="w-5 h-5"></app-icon>
                  </button>

                  <!-- Popover (Only show if active) -->
                  @if (activeHotspot() === spot.id) {
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-white p-3 rounded-lg shadow-2xl z-20 animate-fade-in origin-bottom">
                      <!-- Arrow -->
                      <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                      
                      <div class="relative z-10 text-center">
                        <img [src]="spot.product.image" class="w-16 h-16 mx-auto rounded mb-2 object-cover">
                        <h4 class="font-bold text-sm text-charcoal leading-tight">{{ spot.product.name }}</h4>
                        <p class="text-honey text-sm font-bold my-1">{{ spot.product.price | currency:'VND':'symbol':'1.0-0' }}</p>
                        <button class="w-full text-xs bg-charcoal text-white py-1 rounded hover:bg-honey transition-colors">Xem chi tiết</button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Side Products List -->
            <div class="space-y-6">
              <div class="border-l-4 border-honey pl-4">
                <h3 class="text-xl font-bold text-charcoal">{{ selectedLook().name }}</h3>
                <p class="text-sm text-gray-500">{{ selectedLook().description }}</p>
              </div>
              
              <div class="space-y-4">
                @for (spot of selectedLook().hotspots; track spot.id) {
                  <div class="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-honey" (click)="toggleHotspot(spot.id)">
                    <img [src]="spot.product.image" class="w-20 h-20 rounded object-cover bg-gray-100">
                    <div class="flex-grow">
                      <h5 class="font-bold text-charcoal text-sm md:text-base">{{ spot.product.name }}</h5>
                      <p class="text-gray-500 text-xs mb-2">{{ spot.product.category }}</p>
                      <div class="flex items-center justify-between">
                        <span class="text-honey font-bold">{{ spot.product.price | currency:'VND':'symbol':'1.0-0' }}</span>
                        <button class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-charcoal hover:bg-honey hover:text-white transition-colors">
                          <app-icon name="arrow-right" class="w-4 h-4"></app-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    .animate-zoom-in {
      animation: zoomIn 0.5s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translate(-50%, 10px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes zoomIn {
      from { opacity: 0; transform: scale(1.02); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ShopLookComponent {
  homeFacade = inject(HomeFacade);
  
  // Start with the first look
  selectedLook = signal<ShopLook>(this.homeFacade.shopLooks()[0]);
  activeHotspot = signal<number | null>(null);

  selectLook(look: ShopLook) {
    this.selectedLook.set(look);
    this.activeHotspot.set(null); // Reset hotspots when changing room
  }

  toggleHotspot(id: number) {
    if (this.activeHotspot() === id) {
      this.activeHotspot.set(null);
    } else {
      this.activeHotspot.set(id);
    }
  }
}
