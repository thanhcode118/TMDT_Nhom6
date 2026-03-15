import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="py-16 bg-cream">
      <div class="container mx-auto px-4">
        <h2 class="text-center text-2xl md:text-3xl font-bold text-charcoal mb-10">Danh mục yêu thích</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          @for (cat of categories; track cat.name) {
            <div class="group cursor-pointer">
              <!-- Arched Shape Container -->
              <div class="relative overflow-hidden rounded-t-[100px] rounded-b-lg aspect-[3/4] shadow-md border-2 border-transparent hover:border-honey transition-colors duration-300">
                <img 
                  [src]="cat.image" 
                  [alt]="cat.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                >
                <!-- Overlay & Text -->
                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <span class="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-charcoal font-bold text-sm md:text-base shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300">
                    {{ cat.name }}
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class CategoriesComponent {
  categories = [
    { name: 'Phụ kiện bàn', image: 'https://picsum.photos/id/366/400/600' },
    { name: 'Tranh & Khung', image: 'https://picsum.photos/id/824/400/600' },
    { name: 'Góc Ban công', image: 'https://picsum.photos/id/629/400/600' },
    { name: 'Đồ dùng bếp', image: 'https://picsum.photos/id/425/400/600' }
  ];
}
