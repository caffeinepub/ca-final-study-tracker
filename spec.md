# Specification

## Summary
**Goal:** Fix the subjects initialization flow so that CA Final subjects and chapters load reliably without getting stuck on "Setting up subjects...".

**Planned changes:**
- Fix the backend canister initialization logic to reliably pre-populate all CA Final subjects and chapters on first use, without hanging or timing out
- Ensure subject initialization is idempotent (no duplicates on repeated calls)
- Fix the frontend `useSeedData` hook to correctly detect unseeded state, trigger seeding, and exit the loading state promptly once seeding completes
- Add a timeout/fallback in the frontend so the UI never hangs indefinitely — show a user-friendly error if seeding fails or takes too long
- Invalidate subjects and chapters queries after seeding so the UI reflects the newly populated data

**User-visible outcome:** The app no longer gets stuck on "Setting up subjects..." — subjects and chapters appear within a few seconds of loading, and a clear error message is shown if initialization fails.
