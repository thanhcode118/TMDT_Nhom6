# Frontend Architecture (Angular E-commerce)

## Goals
- Keep the codebase modular and scalable for medium-to-large growth.
- Separate UI from domain models and data-access.
- Keep mock data shaped like backend entities so API integration is low-impact.

## Current Work-tree

src/
- core/
  - models/
    - product.model.ts
    - category.model.ts
    - user.model.ts
    - cart.model.ts
    - order.model.ts
    - content.model.ts
    - index.ts
  - mock-data/
    - ecommerce.mock.ts
  - services/
    - data.service.ts
- features/
  - home/
    - components/
      - home.component.ts
      - hero.component.ts
      - trust-bar.component.ts
      - categories.component.ts
      - shop-look.component.ts
      - flash-sale.component.ts
      - trending.component.ts
      - brand-story.component.ts
      - new-arrivals.component.ts
      - social-proof.component.ts
    - data-access/
      - home.facade.ts
  - catalog/
    - components/
      - category.component.ts
      - new-collection.component.ts
    - data-access/
      - catalog.store.ts
      - catalog.facade.ts
  - search/
    - components/
      - search-results.component.ts
    - data-access/
      - search.facade.ts
  - checkout/
    - components/
      - checkout.component.ts
    - data-access/
      - checkout.facade.ts
  - content/
    - data-access/
      - content.store.ts
  - commerce/
    - data-access/
      - commerce.store.ts
- shared/
  - components/
    - header.component.ts
    - footer.component.ts
    - floating-actions.component.ts
    - icon.component.ts

## Responsibility Split
- core/models: Domain entities used by UI and data-access.
- core/mock-data: Typed mock source mirroring backend entity shape.
- features/*/components: Domain UI for home, catalog, search, and checkout.
- features/*/data-access: Feature state and data orchestration (catalog, content, commerce).
- features/*/data-access/*facade.ts: Domain-level facade APIs consumed by components.
- shared/components: Reusable app shell and common UI primitives.

## Import Convention
- Use alias imports with `@/` for cross-domain imports.
- Keep relative imports only for files inside the same folder.
- core/services/data.service.ts: Application facade consumed by UI.
- services/data.service.ts: Backward-compatible alias for old import paths.

## Why this scales
- New API integration can replace mock-data in feature stores without breaking UI contracts.
- Entity typing is centralized, reducing accidental shape drift.
- Feature stores can be upgraded independently (pagination, caching, API calls).

## Next migration steps
1. Add HttpClient repositories per feature and swap out mock constants.
2. Add unit tests for stores and facade selectors.
