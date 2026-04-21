# Domains

This folder organizes code by domain at the `awkn-0s1` project root.

Recommended structure:

```text
domains/
  <domain_name>/
    caps/
      <capability_name>/
        ui/
        shared/
        common/
        utils/
        workflows/
        api/
        entities/
        functions/
        adapters/
          db/
        cap_processor.ts
        .env
    domain_processor.ts
    domain_api.ts
    domain_ui.tsx
  admin/
```

Notes:

- `domains/` belongs directly under `awkn-0s1`.
- A capability, or cap, owns its UI, workflows, data access, and helper logic.
- `cap_processor.ts` is the main orchestration layer for the capability.
- `domain_processor.ts` coordinates all capabilities inside a domain.
- `domain_api.ts` aggregates capability APIs into one domain-facing API surface.
- `domain_ui.tsx` is the UI shell that composes capability-level shells.
