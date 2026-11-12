# Recapture list for `screenshots/ux/`

All 49 shots were taken in the older Space Works **Events** app palette (lime-green sidebar, teal buttons).
They are recaptured from SpaceWorks 0.12.0 on the dev stack (`./scripts/dev.sh up --build`, web at
`http://localhost:5000`) with the current palette (`tokens/tokens.json`), keeping the **same file names**.

Viewports: **desktop** = 1280x800, **phone** = 390x844. Themes: **light** and **dark**; phone shots are light only.
Naming: `<screen>-<desktop|phone>-<light|dark>.webp`. Capture dark by adding the `dark` class to `<html>`
(or the theme toggle). The route column is the best-known match from the 0.12.0 router
(`frontend/src/`); the owner of the live pass should confirm each one when capturing.

| # | File stem | Screen shown in the old shot | SpaceWorks 0.12.0 route to recapture from | Variants |
|---|---|---|---|---|
| 1 | `account-profile` | Account profile: avatar, display name, tabs (Profile, Registrations, Your IDs, Organisations, Security) | `/m/<slug>/member/account` (signed-in member) | desktop light, desktop dark |
| 2 | `auth-reset-password` | Reset password card: email field, "Send reset link" | `/reset-password` | desktop light, desktop dark |
| 3 | `auth-sign-in` | Welcome back sign-in: Sign in / Create account switch, email + password, brand panel on the right | the sign-in page (`/login`, or any protected route while signed out) | desktop light, desktop dark, phone light |
| 4 | `detail-overview` | Event detail, Overview tab: date tile, stat cards, "Almost ready" checklist | `/m/<slug>/admin/events/<id>` (staff console, event overview) | desktop light, desktop dark, phone light |
| 5 | `flow-check-in` | Check-in desk: QR scanner, search attendees, override toggles | `/m/<slug>/admin/events/<id>` Check-in tab (staff scan flow) | desktop light, desktop dark, phone light |
| 6 | `form-new-organisation` | Create an organisation form: name, web address, description, logo | `/organizations/new` (new organisation form) | desktop light, desktop dark |
| 7 | `list-guests` | Event Guests tab: status filter chips, guest rows with Approve / Decline | `/m/<slug>/admin/events/<id>` Guests tab | desktop light, desktop dark, phone light |
| 8 | `list-member-ids` | Member IDs list: programme, tabs, table with ID number / status / valid until | `/m/<slug>/admin/members` Member IDs view (membership module) | desktop light, desktop dark, phone light |
| 9 | `public-event` | Public event page: title, venue map, "Join this event" register card | `/m/<slug>/events/<publicToken>` | desktop light, desktop dark, phone light |
| 10 | `public-organisation` | Public organisation page: header, upcoming/past tabs, event rows | `/o/<organizationSlug>` | desktop light, desktop dark, phone light |
| 11 | `public-ticket` | Ticket confirmation "You're in": event card and QR code | registration confirmation / ticket view after registering on `/m/<slug>/events/<publicToken>` | desktop light, desktop dark, phone light |
| 12 | `public-verify-card` | Public "Valid card" verification result for a member ID | public member-ID verify page (`/verify/<token>`) | desktop light, desktop dark, phone light |
| 13 | `public-verify-not-found` | Verification "Card not found" state | same verify page with an unknown token | desktop light, desktop dark, phone light |
| 14 | `settings-organisation` | Organisation Settings: logo, name, description, live public-page preview | `/organizations/<organizationSlug>/settings` | desktop light, desktop dark, phone light |
| 15 | `table-team` | Members / team table: stat cards, invite link, role selector, "what each role can do" | `/organizations/<organizationSlug>/members` (or `/m/<slug>/admin/staff`) | desktop light, desktop dark |
| 16 | `workspace-dashboard` | Workspace dashboard: greeting, next-up event card, stat tiles, activity | `/m/<slug>/admin` (staff console home) | desktop light, desktop dark, phone light |
| 17 | `workspace-empty-state` | Brand-new organisation: "ready" checklist with setup steps, no events yet | `/m/<slug>/admin` for a freshly created makerspace | desktop light, desktop dark |
| 18 | `workspace-organisations` | Organisation overview: banner, name, Settings / New series / New event actions, pending-approval notice, event + calendar | `/organizations/<organizationSlug>` | desktop light, desktop dark |

Total: **49 files** (18 screens: 18 desktop light, 18 desktop dark, 13 phone light).

Notes for the live pass:

- Use the seeded demo data so the shots stay consistent (Space Works Kochi, Demo Organiser, "Kochi Maker Night").
- The old shots show the Events product chrome ("space works / Events"); the new shots show whatever 0.12.0
  chrome the route renders. If a screen no longer exists in 0.12.0, keep the old file and list it in the pass report.
- Re-encode as WebP (quality ~80) at the sizes above; keep each file small.
