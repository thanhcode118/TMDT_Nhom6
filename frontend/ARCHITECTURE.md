# Frontend Architecture (Angular E-commerce)

## Goals

- Keep the frontend consistent with the current mock-first product scope.
- Separate route shells, feature state, and reusable UI without introducing unnecessary layers.
- Preserve contracts so mock data can be replaced later with API-backed data with minimal UI churn.

## Runtime Baseline

- Angular `21.1.x`
- `bootstrapApplication(...)`
- `provideRouter(routes)`
- `provideZonelessChangeDetection()`
- Standalone components only
- Signals / computed for most state
- Template-driven forms
- Tailwind utility classes

## Current Source Shape

```text
src/
  app.component.ts
  app.routes.ts
  core/
    models/
      product.model.ts
      category.model.ts
      user.model.ts
      cart.model.ts
      order.model.ts
      content.model.ts
      index.ts
    mock-data/
      ecommerce.mock.ts
      header-navigation.mock.ts
  features/
    auth/
      data-access/
        auth.facade.ts
    home/
      components/
        home.component.ts
        hero.component.ts
        trust-bar.component.ts
        categories.component.ts
        shop-look.component.ts
        flash-sale.component.ts
        trending.component.ts
        brand-story.component.ts
        new-arrivals.component.ts
        social-proof.component.ts
      data-access/
        home.facade.ts
    catalog/
      components/
        category.component.ts
        new-collection.component.ts
      data-access/
        catalog.store.ts
        catalog.facade.ts
        category-page.facade.ts
    search/
      components/
        search-results.component.ts
        search-active-chips.component.ts
        search-filter-panel.component.ts
        search-results-content.component.ts
        search-results.types.ts
      data-access/
        search.facade.ts
        search-query-state.ts
    checkout/
      components/
        checkout.component.ts
      data-access/
        checkout.facade.ts
    content/
      data-access/
        content.store.ts
    commerce/
      data-access/
        commerce.store.ts
  shared/
    components/
      header.component.ts
      header-navigation.component.ts
      header-search.component.ts
      header-actions.component.ts
      footer.component.ts
      floating-actions.component.ts
      icon.component.ts
```

## Responsibility Split

- `core/models`: shared domain types used by feature state and UI.
- `core/mock-data`: typed mock sources and static app configuration.
- `features/*/components`: route shells and domain UI.
- `features/*/data-access`: feature state, filtering, lookup, facade/store orchestration.
- `shared/components`: app shell and reusable UI shared across multiple screens.

## Dominant Patterns

### Feature-first structure

- New feature code lives under `features/<domain>`.
- Shared shell/UI lives under `shared/components`.
- Shared domain types and mock/config data live under `core`.

### Store + facade for shared feature state

- `catalog.store.ts` and `catalog.facade.ts` are the clearest example of the main pattern.
- `category-page.facade.ts` keeps page-local category state out of the component.
- Smaller features may still use facade signal-only state when the scope is limited.

### Route shell + presentational children

- `search-results.component.ts` is the route shell.
- Search filter chips, filter panel, and results content are split into child components.
- `header.component.ts` is the shell; navigation, search, and actions are split into child components.

### Mock-first data access

- Product data and supporting collections come from `core/mock-data/ecommerce.mock.ts`.
- Header navigation data comes from `core/mock-data/header-navigation.mock.ts`.
- There is no runtime `core/services/data.service.ts`.
- There is no repository/API layer in the current frontend.

## Import Convention

- Use `@/` alias imports for cross-feature or cross-layer imports.
- Keep relative imports for same-folder files.

## Testing Strategy

- Test scope is intentionally lightweight.
- Route shells have smoke/behavior tests where risk is higher.
- Stores/facades have contract tests for filtering, lookup, cart, and query-state behavior.
- Tests run through `ng test`.

## What This Architecture Is Not

- It is not a clean-architecture layering exercise.
- It is not NgRx-based global state management.
- It is not API-first yet.
- It does not currently include guards, interceptors, or repository abstractions as standard building blocks.

## Near-term Migration Guidance

1. Keep strengthening behavior-preserving tests before large refactors.
2. Keep route-level orchestration in shells and extract reusable/presentational parts only when the boundary is already clear.
3. Introduce API-backed data access only after backend contracts are real and stable.
