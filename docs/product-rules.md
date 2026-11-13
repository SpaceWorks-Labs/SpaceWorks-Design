# Space Works product rules

The general rules every product in the Space Works organisation follows. They are written for any product:
the Django app (SpaceWorks), the Next.js apps (Workspace, Events, Machines, Inventory, Bookings,
Organization), the native apps (Android, iOS), the website, the docs and this design system. They were
collected from each repository's README, `CLAUDE.md` / `AGENTS.md`, contributing guides and docs.

Each rule has the same parts: **Rule**, **Why**, **How to apply**, **Across the org** (what each product does
today, and where one does not follow the rule yet). A rule that says "not checked" means we have not read
the code for that product; it is not a claim either way.

Related pages: [`theming.md`](theming.md), [`motion.md`](motion.md), [`lessons-learned.md`](lessons-learned.md),
[`whats-new-v2.0.md`](whats-new-v2.0.md), [`ui-brand-spec.md`](ui-brand-spec.md),
[`ux-spec.md`](ux-spec.md).

The products, for short:

| Product | What it is | Stack |
| --- | --- | --- |
| **SpaceWorks** | The main makerspace platform (inventory, loans, machines, events, bookings, membership, payments, reports, installer) | Django + DRF, React, PostgreSQL, Redis, Celery |
| **Workspace** | Internal workspace for maker organisations (projects, chat, docs, files, finance, assistant) | Next.js, Prisma, PostgreSQL |
| **Events** | Event pages, registration, QR tickets, check-in, ID cards, certificates | Next.js, Prisma, PostgreSQL |
| **Machines** | Machine catalogue, job queue, pricing, repairs, maintenance, printer connections | Next.js, Prisma, PostgreSQL |
| **Inventory** | Stock room and lending desk with photo-evidence handovers | Next.js, Prisma, PostgreSQL |
| **Bookings** | Rooms, studios, desks and halls | Next.js, Prisma, PostgreSQL |
| **Organization** | Memberships, plans, renewals, receipts, ID cards | Next.js, Prisma, PostgreSQL |
| **Android** / **iOS** | Native member and staff apps | Kotlin, Jetpack Compose, Material 3 / Swift, SwiftUI |
| **Website**, **Docs** | Landing page (static HTML) and docs site (Astro Starlight) | static / Astro |
| **SpaceWorks-Design-System** | This repository: brand, tokens, fonts, motion, UX specs; site at https://spaceworks-labs.github.io/SpaceWorks-Design-System/ | tokens / Starlight site |

---

## 1. Stack

**Rule.** Use one of the two web stacks, or a native stack for a phone app. Do not introduce a third. Every
surface draws its colours, type and motion from the shared design system.

**Why.** One small set of stacks means any engineer can move between products, installers and CI are shared,
and a fix in one place can be copied to its siblings.

**How to apply.**

| Stack | Pieces | Use it when |
| --- | --- | --- |
| **A. Django** | Django + DRF API, React + Vite + TypeScript, TanStack Query, PostgreSQL 16, Redis, Celery worker and beat, S3-compatible private storage, drf-spectacular (OpenAPI) | The product is the platform itself, or needs a long-lived API that web and native apps share |
| **B. Next.js** | Next.js (App Router) + React + TypeScript, Prisma, PostgreSQL, Redis (rate limits, BullMQ jobs), S3-compatible private storage, Auth.js, Tailwind CSS 4 with Radix primitives, Vitest and Playwright | A standalone app that one organisation can self-host on its own |
| **C. Android** | Kotlin, Jetpack Compose, Material 3, generated OpenAPI client | Native Android app |
| **D. iOS** | Swift, SwiftUI (iOS 17+), generated OpenAPI client | Native iPhone and iPad app |

- Native apps never hand-write API models. They use a client generated from `api/openapi.json` and never call
  a route that is not in it.
- Colours, fonts, spacing and motion come from this repository (`tokens/`, `motion/`), consumed as a git
  submodule or a synced copy. Never hard-code a hex colour in a component. See [`theming.md`](theming.md).
- Write the product name as "Space Works" in copy; "SpaceWorks" is for repository and code names.

**Across the org.** SpaceWorks: stack A. Workspace, Events, Machines, Inventory, Bookings, Organization: stack
B (all with PostgreSQL 16 and Redis; Machines, Inventory, Bookings and Organization add a BullMQ worker and
beat). Android: C. iOS: D. Website: plain static HTML with a small Python build step. Docs: Astro Starlight.
SpaceWorks-Design-System: tokens, fonts, brand masters and a Starlight site.

---

## 2. Install and hosting

### 2.1 One-line install is the default

**Rule.** Every server product installs with one line, from a published release, and asks every question
before it changes anything.

**Why.** Makerspaces do not have a platform team. A guided installer that shows a summary, waits for a
confirmation and can roll back is the safest thing we can hand them.

**How to apply.**
- The command is `curl -fsSL <release or raw install.sh URL> | sh` (or `| bash`). SpaceWorks serves it from
  GitHub Releases (`releases/latest/download/install.sh`); the Next.js apps serve it from the repository's
  `main` branch and download the release images.
- The script is wrapped in one function so a cut-off download runs nothing, checks the release checksum (and
  the signature where the tool is present), and prints one final block: the address to open, how to sign in,
  and where the log is.
- Running the same command again on an existing install shows a menu: update, back up now, check health,
  backups schedule, change settings, server security, automatic deploys, recover the super admin, support
  bundle (secrets redacted), uninstall (data kept unless the person types a confirmation).
- Updates take a backup first, pull the new images while the site keeps running, migrate, and roll back
  automatically if the new release is not healthy.
- Images are built by CI and published; **nothing is compiled on the customer's server**. One image serves
  every installation, so nothing installation-specific is baked in; public origins are placeholders swapped
  at start.
- Secrets are generated by the installer, never printed, and never regenerated on an update.
- Provide an inspect-first path (download, read, run) for people who will not pipe to a shell.
- Windows: Linux servers are the target. SpaceWorks supports Windows through WSL2 or a Linux VM.

**Across the org.** SpaceWorks, Workspace, Events, Machines, Inventory, Bookings, Organization: one-line
installer present (README). Events documents the fullest menu (ten options). Android and iOS are not
server products: they ship through GitHub Releases (CI builds are unsigned; owner signing is needed for the
stores). Website and Docs deploy as static sites.

### 2.2 VPS default setup

**Rule.** The default shape is one Linux VPS running everything in Docker Compose behind a reverse proxy with
automatic HTTPS.

**Why.** It is the one shape every product tests end to end, and the only one with the complete backup,
restore and update-rollback contract.

**How to apply.**
- Services: backend (API, plus migrate and operator-tool roles), frontend, PostgreSQL 16, Redis 7, private
  S3-compatible object storage (bundled Silo, the maintained MinIO-compatible fork, or an external bucket),
  a worker and a beat (timed jobs), and a reverse proxy (Caddy: automatic Let's Encrypt, a LAN CA for trials,
  or the person's own proxy).
- Run Compose with `compose.production.yml` (or `docker-compose.prod.yml`). Development and staging Compose
  files are never production setups.
- Migrations are a separate release step, never part of app start-up.
- A small instance needs about 2 vCPU, 2 GB RAM and 30 GB SSD. The installer checks DNS, ports 80 and 443,
  and an authenticated SMTP relay before starting.
- Offer server hardening in the installer: a firewall allowing only SSH, HTTP and HTTPS, automatic security
  updates, fail2ban.
- Logs rotate (for example 10 MB per file, five files).

### 2.3 Self-host, managed and hybrid

**Rule.** There is one product and one deployment mode: the owner runs it. "Managed" is an optional setting
on that same install, and "hybrid" is a way of placing its components. Nothing managed is active by default.

**Why.** Two products (self-hosted and cloud) would drift apart. One product with dormant managed features
cannot.

**How to apply.**
- **Self-host:** everything on the owner's server. The default. Fully works with no outside service.
- **Managed / hosted spaces:** the owner may switch on "hosting other makerspaces" to run spaces for other
  people (plans, per-space limits, trial, hosting invoices, subdomains, custom domains). When it is off every
  space is an "own" space with no limits, and every managed screen and route is inert. In SpaceWorks this is
  keyed off whether a platform domain suffix is set.
- **Hybrid (required for every server product): a per-part choice.** The **database**, **Redis**, **file
  storage**, **email** and the **website** each run on this server or outside (managed database, S3-compatible
  storage, SMTP or an email API, a CDN or static host), independently of each other, and every part defaults
  to local. The installer **asks per part** and **probes each outside part before anything starts**. This is
  the SpaceWorks model, and it is the rule for every product. In SpaceWorks the choices are **website** (on
  this server, elsewhere, or none: API-only), **database** (bundled PostgreSQL 16, or any outside PostgreSQL
  16 or 17 such as Supabase, Neon, RDS), **Redis** (bundled, outside, or none), **file storage** (bundled
  Silo, or any S3-compatible service such as R2, B2, S3), and **email** (SMTP or an API provider). The
  Next.js **split** layout (website on Netlify or another static host, everything else on the VPS) is only
  one case of this rule, not the whole of it. Moving a part later (for example Redis none, bundled, outside)
  is one supported command.
- Every outside service is **tested before anything starts** (reachability, an empty database on first
  install, a signed upload). A database behind a transaction pooler is refused (advisory locks, migrations and
  `pg_dump` cannot run through one). The running services never receive the database owner login.
- Declare a storage capability profile (`limited` or `full`) and never treat a limited store as the stronger
  kind.
- Both sides of a split must be HTTPS (sign-in uses cross-site cookies). Deploy the same source revision to
  both halves.
- **No-Redis (lite) mode:** background jobs run in the request, scheduled jobs run from a once-a-minute
  scheduler loop, the cache lives in the database and live screens poll. Suits a small space. Moving between
  none, bundled and outside Redis later must be one command.
- Other shapes (cloud blueprints, a free profile with hard caps, Helm) are documented as packaging of the same
  product, each stating what it gives up.

### 2.4 Backups, restore, upgrades

**Rule.** A backup exists before every change, and a restore is a deliberate, documented step.

**How to apply.**
- Nightly database, config and uploaded-file backups, optionally encrypted to a key kept off the server
  (`age`) and copied off site. A failed or stale backup shows in the operations screen and is emailed.
- Restore is an explicit script, never automatic. Backups, restore and tenant migration must work against an
  outside database with a client whose major version equals the server's.
- A tenant (one space) can be exported as a portable dump and moved to another server; publication refuses if
  money moved after the freeze.
- Upgrades only move forward; a re-run over an existing install is an update.

**Across the org 2.2 to 2.4.** SpaceWorks: full VPS, split (API-only), hybrid database/Redis/storage/email,
no-Redis mode, cloud and free profiles, Helm, tenant migration. Events: full VPS, split layout with Netlify,
external S3, existing proxy, age-encrypted backups with off-site copy, Render and Helm. Workspace, Inventory:
VPS install, split frontend (Netlify) and external-storage and external-proxy Compose overlays. Machines,
Bookings: VPS install, Netlify split, no-Redis development mode (`JOBS_INPROCESS`). Organization: VPS install,
Netlify split. For the Next.js apps other than Events, an outside-database or per-component installer
question is **not checked**; their READMEs describe split and external storage/proxy, not the full
SpaceWorks questionnaire. Android and iOS: n/a, but they take any server URL and validate it against the
health endpoint.

### 2.5 Release images: frontend and backend only

**Rule.** A product release publishes exactly two container images: `<product>-frontend` and `<product>-backend`
(multi-architecture: amd64 and arm64), verified after publishing. Everything else a deployment runs is NOT a product
image: the database (Postgres), Redis, object storage (Silo/S3-compatible), the reverse proxy, and any other
infrastructure come from their upstream images at a pinned version, pulled by the install script according to the
choices made in setup. Background workers and schedulers (Celery worker and beat, migrations, one-off jobs) run from
the backend image with a different command — never a third image. No all-in-one image.

**Why.** Two images keep releases small, cacheable and auditable, and let every deployment shape (one VPS, split
hosting, outside database or storage, no-Redis mode) be assembled from the same artefacts. An all-in-one image hides
version drift of bundled services, cannot use a managed database or storage, and doubles what has to be built,
scanned and supported. (SpaceWorks retired its all-in-one image in 0.10 and removed it from the registry for 0.12.0.)

**How to apply.**
- CI builds and publishes only the two images; a release check fails if any other image is pushed.
- The install script asks which parts run locally or outside (§2.3), tests every outside service first, then pulls
  and starts only what is needed (`compose pull` + `up -d`); pinned upstream tags live in the compose file and are
  bumped deliberately.
- Update scripts pull the new frontend/backend tags plus any changed infrastructure pins, then migrate.
- Documentation lists the two images and every pinned upstream image with its version.
- **Object storage is Silo.** The bundled object store is Silo (`pgsty/silo`), pinned by `SILO_IMAGE_TAG` in
  SpaceWorks. An outside store must be S3-compatible (AWS S3, Cloudflare R2, Backblaze B2, …). In SpaceWorks the
  compose service and its volume keep the historical names `minio` / `minio_data` on purpose: renaming them would
  detach the existing evidence data on update.

---

## 3. Areas and modules

**Rule.** Every optional feature is a switchable **area** (the code calls it a module), registered in one
place. Off means gone everywhere. Switching off keeps the data; deleting it is a separate, explicit purge.

**Why.** A space that does not run events must not see event menus, dead links or empty reports.
Half-visible features confuse people and leak data.

**How to apply.**
- One registry holds each area's key, label, description, group, dependencies, default and whether it is
  core. Defaults, workflow lists and the feature catalogue derive from it; never keep a second list.
- Two levels: **platform switch** (the owner allows it on this install) and **per-space switch** (a space turns
  it on). A feature inside an area has its own key under the area.
- When an area is off: hide it in navigation, tabs, widgets and search; refuse its routes with a typed "not
  found" that names the area; leave it out of reports; skip its notifications and background jobs; remove it
  from public pages.
- **Opt-in, default off** for anything not needed to run a basic space. **Core** areas that a hard rule depends
  on (public catalogue, request workflow, evidence upload, QR) cannot be switched off. Personal accounts are
  always on; reports are on by default.
- **Switching off is reversible; purging is not.** Purge is a second, privileged step that deletes one area's
  rows. No single action may both hide and destroy. A purge never deletes a payment record.
- A retired key is mapped to its replacement, never offered again, so old backups and API clients keep
  working.
- Installers ask about **areas**, not module keys, in plain words, with presets.
- Changing a key means editing the user-facing modules page in the same change.

**Across the org.** SpaceWorks: full registry, platform and per-space switches, install, uninstall and purge,
drift-guard tests. Workspace: product areas (work, chat, knowledge, people, operations, finance and others) with
one navigation config and `docs/areas/`; per-space on/off switches **not checked**. Events: instance settings
switch paid events and other features on; a general area registry **not checked**. Machines, Inventory,
Bookings, Organization: single-purpose products (one area each); per-feature switches **not checked**.
Android and iOS: show only what the server's area and role payload allows (fixed-tenant staff authority).

---

## 4. Role-based views

**Rule.** Permissions are **action-based**. Screens ask "may this person do X here?", never "is this person an
admin?". Every query is scoped to the tenant. The interface shows only what the role can use, and the server
refuses the rest.

**Why.** "Admin or not" is too coarse. A front-desk volunteer needs a small, safe console; a finance role
should not see staff settings. And a missing scope is a cross-tenant data leak.

**How to apply.**
- Define roles as sets of capabilities in one file (for example `lib/permissionRoles.ts`, `lib/roles.ts`,
  `apps/accounts/rbac.py`). Allow **custom roles** built from a fixed list of capabilities, with protected
  default roles seeded per tenant.
- Check capabilities (`requireCapability`, `can(actor, action, resource)`), never role names, in pages,
  actions, API routes, notification recipients and reports.
- **Area hide:** navigation, tabs, widgets, report rows and search results show only what the role holds. Hiding
  is not security; the server checks again.
- **Narrow consoles for narrow roles.** A handover or front-desk role gets a short console with no dashboard
  widgets or unrelated queues. Area managers see the whole of their own area (finance, to-buy, repairs,
  reports, audit); the top manager sees all areas combined and grouped.
- **Three surfaces stay distinct:** staff, member and platform admin. Staff always use the Space Works palette;
  members may use derived tenant colours.
- **Platform admin is separate and global.** It opens only from the server-set identity, with a fresh second
  factor, answers a plain "not found" to everyone else, and is web-only: the phone apps refuse platform-admin
  accounts.
- Cross-tenant access returns **404**, never 403, so a slug never reveals that a space exists.
- Every tenant always keeps one active top-level owner; admins cannot act on other admins or owners.
- Staff need an authenticator (TOTP) before the staff console opens. Borrowing or membership **standing**
  (good, restricted, suspended) is separate from the role.
- The same person has the same authority on web and on a native token.

**Across the org.**

| Product | Roles today |
| --- | --- |
| SpaceWorks | Per-space editable roles; defaults Space Manager, Inventory Manager, Machine Manager, Member; custom roles for handover; platform superadmin |
| Workspace | OWNER > ADMIN > MEMBER > GUEST, capabilities in `lib/roles.ts`; super admin with 10-minute TOTP step-up |
| Events | Organisation OWNER/ADMIN/MEMBER plus event co-organiser, judge and mentor grants; staff MFA each session; super admin |
| Machines | Machine manager, machine type manager (scoped to types), operator, technician, member; capabilities in one file |
| Inventory | Inventory manager, staff, member, technician (no admin or owner role); `ROLE_MATRIX` |
| Bookings | Bookings manager, front desk, viewer, technician |
| Organization | Custom `OrgRole`s per organisation from a fixed permission list, plus unit hierarchy scoping |
| Android / iOS | Staff screens permission-aware; tablet and phone; superadmin refused |

---

## 5. Code size and modularity

**Rule.** About 200 lines per file is the target; **300 is a hard ceiling**. One responsibility per file.

**Why.** Small files can be read, reviewed and tested in one sitting. Large ones hide bugs and make every
change touch unrelated code.

**How to apply.**
- Split by responsibility (routes, validation, service logic). In stack A use submodules (`views_*`,
  `serializers_*`, `services_*`) behind a **thin re-export barrel** with explicit imports, never `import *`.
  In stack B turn `lib/area/service.ts` into `lib/area/service/` with an `index.ts` re-export so import paths
  stay stable.
- Never meet the limit by joining lines, packing statements or deleting useful comments.
- **Split an over-ceiling file in its own commit before adding to it.**
- Before moving code, check for guards pinned to a file path; a moved function can make such a guard go
  silently blind. Update the pin in the same commit.
- A `"use server"` file keeps every exported action defined in it; move helpers to a sibling folder.
- Exempt: generated files (OpenAPI types, frontend catalogues), a framework settings file, tests (in stack A).

**Across the org.** Stack B counts 300 non-blank, non-comment lines, tests and scripts included, enforced by
the ESLint `max-lines` rule (error) and a unit test in Workspace, Events, Machines, Inventory, Bookings and
Organization (the last runs `tests/unit/file-length.test.ts`). SpaceWorks: reviewed per change with a small
published list of over-ceiling files; the React frontend has none. Android and iOS: **not checked**.

---

## 6. Money and payments

**Rule.** **Record the debt first, add a payment rail second.** Money is always an integer in minor units with
its currency. Stripe and Razorpay are both supported, alongside offline payments with receipts.

**Why.** A space can owe or be owed money with no payment provider. Floats lose cents. Currencies differ in
decimals (JPY none, KWD three).

**How to apply.**
- **Ledger before gateway.** Every charge is recorded whether or not an online provider is configured. The
  ledger is permanent core; only the online rail (checkout, refunds, provider settings, webhooks) is
  removable. A purge never deletes a payment.
- **Minor units and currency.** Store integers (paise, cents) with an ISO currency code, or fixed-point
  decimals. Never `float`. Never add across currencies. Round with the currency's own decimals.
- **Providers.** Each space or organisation uses **its own** Stripe or Razorpay account; there is no platform
  fee or platform-wide fallback key. Support both in every product that takes money. Supporting **offline**
  too: cash, bank transfer, UPI, card terminal, pay later, recorded by staff.
- **Offline needs a receipt.** Marking a charge paid offline writes a settlement record (method, reference,
  received date) once; corrections are new rows that amend, never edits. An optional maker-checker rule can
  require a second person to confirm.
- **Idempotent.** The same webhook event or order key never settles twice (processed-event table, order
  idempotency key). Razorpay deliveries are de-duplicated by event id and by a hash of the signed body.
- **Webhooks are verified** with the provider's signature, per space, before any state changes; unknown
  tenants and archived spaces are refused.
- **Provider switch keeps old keys usable.** After a space switches from one provider to the other, the old
  provider's keys stay usable for settling and refunding existing charges. Rotating or clearing keys refuses
  while collections are pending.
- **Unknown outcome stays pending.** A provider timeout or unreadable response leaves the charge pending and
  reserved; it is never guessed as paid or failed.
- **Refunds** follow the space's refund policy, are recorded as their own rows and never exceed what was paid.
- **Secrets never leave the server.** Provider keys and webhook secrets are write-only in every screen,
  encrypted at rest with a key bound to the tenant, and never in logs, audit metadata, URLs or API replies.
  Only publishable keys go to the browser or the app.
- Receipts are numbered without gaps; credit notes for refunds; tax receipts (for example GST) where a
  product needs them.
- Prize money and payouts are recorded by a person, never sent automatically.

**Across the org.**

| Product | Money today |
| --- | --- |
| SpaceWorks | Stripe and Razorpay per space, offline with receipts, charge tracking independent of the payments rail, reconciliation, refunds |
| Events | Razorpay and Stripe on the organiser's account, pay at the desk, refunds, PDF receipts, chargeback alerts |
| Machines | Razorpay or Stripe, or desk payments (cash, UPI, bank, card terminal), optional maker-checker |
| Inventory | Razorpay, Stripe, cash or bank, or pay later, for late fees and damage charges |
| Bookings | Razorpay Checkout, Stripe Checkout, cash, UPI, bank, pay later, gapless receipts and credit notes |
| Organization | Razorpay, Stripe, UPI, bank, cash, GST receipts |
| Workspace | Finance records (income, expenses, bills, reimbursements, payroll records); **no payment gateway found** |
| iOS / Android | Server-selected checkout (iOS: Stripe SDK and Razorpay per README); Android: Stripe Android SDK per the SpaceWorks mobile spec, Razorpay **not checked** |

---

## 7. Audit trails and logs

**Rule.** Every state change writes an audit entry. Audit is append-only. Evidence is immutable. Logs are
structured and carry no secrets or personal data.

**Why.** The product exists to prove who did what. If history can be edited, or logs leak credentials, the
proof and the privacy are both worthless.

**How to apply.**
- **One audit service.** Write through a single function (`apps.audit.services.record`, `recordAuditEvent`,
  `recordSettingsChange`), inside the same transaction as the change. Settings changes record the changed
  **field names, never values**.
- **Append-only** in the model and, where the stack allows, by database trigger. Archiving a space keeps its
  trail; only an explicit, audited purge removes it.
- **One module owns each state machine** (request or loan status), and **one module owns quantity maths**
  (availability never below zero). Web, apps and admin pages all call them; nothing sets a status directly.
- **Evidence is immutable.** Photo rows and QR scan records cannot be edited or deleted once attached. Photo
  bytes may expire under the retention policy; the row, remarks, scans and audit trail stay. Uploads land on a
  staging key; a workflow promotes them exactly once.
- Hard rules: issuing needs a scan and an issue photo; returning needs a photo and a remark.
- **Structured logs.** JSON lines in production with UTC time, level, logger, message and a **request id**
  (accept a clean `X-Request-ID`, else generate one, echo it in the response, copy it into background jobs).
- **Never log** passwords, API keys, bearer tokens, provider credentials, invitation or reset links, contact
  details or free text. Use ids, action keys and outcomes.
- Health: a dependency-free liveness endpoint, protected readiness and metrics endpoints with generic
  "unauthorized" answers, Prometheus metrics labelled by route template (never raw URLs).
- Outbound email and webhooks are queued (an outbox), retried safely, and emitted only after the transaction
  commits.

**Across the org.** SpaceWorks: audit service with database triggers, append-only evidence, request id
logging, audit action reference. Workspace, Events, Machines, Inventory, Bookings, Organization: audit helper
and audit log screen in the app; Inventory states evidence, the stock ledger and audit log are append-only.
Database triggers on the Next.js apps' audit tables: **not checked**. Android and iOS: audit is server-side;
the apps only send evidence through the server's workflow.

---

## 8. Analytics

**Rule.** Every product has **in-house, counts-only reports that are always on**, and every product supports
the **same optional list of outside providers**. Providers are off by default, need consent and a configured
scope, and never receive personal data.

**Why.** Operators need to know how their space is used; visitors need to know nothing about them leaves the
server without their say. One shared list means one set of docs, one privacy review and comparable numbers
across web, iOS and Android.

**How to apply.**

**8.1 In-house (always on).**
- Reports, charts and CSV/XLSX exports from the product's own database, scoped to the tenant and the role.
- Counts, never people: how many, by channel and by day, not who. Member details in analytics are off by
  default.
- The server counts web, iOS and Android use itself from authenticated API calls, so the apps need no extra
  code. Apps may send a build string (`X-SpaceWorks-App-Version`) on API calls; it must never carry a person,
  device or account identifier.
- Read-only dashboards: a per-tenant read-only database login over curated views with row-level security feeds
  **Metabase** or **Grafana**.
- Platform operators also get a deployment dashboard (health, jobs, storage, API monitor) and optional
  Prometheus metrics behind a bearer token.

**8.2 Optional outside providers (all off by default).** Supported list, as verified in SpaceWorks:

| Provider | Purpose (consent) | Notes |
| --- | --- | --- |
| Plausible | Page analytics | Route templates only; self-hosted origin must be allow-listed |
| Umami | Page analytics | Website id and an approved HTTPS origin |
| Google Analytics 4 | Page analytics | Google signals and ad personalisation off |
| Firebase Analytics | Page analytics | Same property as GA4: choose GA4 or Firebase, not both |
| PostHog | Page analytics and/or session replay | Same project and origin for both |
| Microsoft Clarity | Session replay | Anonymous public page only, everything masked |
| Sentry | Diagnostics and performance | Scrubbed URLs, no bodies, public DSN only |
| Firebase Performance | Diagnostics and performance | Manual sanitised traces only |
| Metabase, Grafana | Dashboards | Over the read-only views above |

- Choose **at most one** page-analytics provider; replay and diagnostics are separate choices.
- **Off until two things are true:** the operator configured it, and the visitor consented to that provider's
  *purpose*. Until then no script loads, no request is sent and no cookie or storage key is written.
  Withdrawal stops the provider at once (it cannot erase what the provider already holds).
- Settings take **public identifiers only** (site id, public key, DSN). Never a secret, token or
  service-account file. Changes are audited by field name.
- The operator approves outside hosts on both frontend and backend (an allow-list of HTTPS origins) and the
  Content Security Policy only widens for what is listed.
- Events use approved **route templates**, never raw URLs, query strings or ids. Authenticated, private,
  payment, evidence, credential and unknown routes are **excluded** and fail closed. Replay runs only on
  anonymous public routes, with text and inputs masked and media and network bodies blocked.
- **Tag every event with `client`**: `web`, `ios` or `android`, using the same event names on every client so
  they can be compared. No name, email, phone, member id, device id, token, free text or screen contents.
- **Required for every product, including the native apps.** Android and iOS must support the same optional
  providers as the web, for those that have an official mobile SDK: **Firebase Analytics, Crashlytics and
  Performance, PostHog, Sentry** and **Microsoft Clarity** (replay; Clarity publishes Android and iOS SDKs).
  GA4 is reached through Firebase Analytics on mobile (same property). **Plausible and Umami have no official
  mobile SDK** (HTTP event APIs only): the apps do not call them, and mobile use is covered by the server's
  own counts. Metabase and Grafana read server data and need nothing in the app. Verify each SDK's current
  mobile support and licence when adopting it.
- Mobile rules: every SDK is **compiled in but inert** until the deployment's server config enables it (the
  app reads the provider config from the server, as it does publishable payment keys), **off by default**,
  behind the same consent screen and withdrawal as the web; no personal data; every event carries
  `client: ios` or `client: android` and uses the web's event names; no advertising id, no automatic screen
  or view capture that could expose private content, replay only on non-sensitive screens. A native app's
  contributor rules (`AGENTS.md`) must name **exactly these SDKs** as allowed and keep forbidding any other
  third-party SDK without owner approval.
- Prove it offline: tests that show no loader, request or cookie before consent, and that withdrawal stops it.

**Across the org.**

| Product | In-house reports | Outside providers |
| --- | --- | --- |
| SpaceWorks | Yes, plus Metabase and Grafana | All eight web providers above (verified); Sentry on the backend by setting |
| Workspace | Yes (analytics desk, drill-down, CSV, print packs) | Not found; **not checked** in code |
| Events | Yes (event analytics, funnel, PDF); platform monitoring | "No third-party trackers" stated; providers not present |
| Machines, Bookings | Reports; platform monitoring and API monitor | Not found; **not checked** in code |
| Inventory | Reports and exports | Not found; **not checked** in code |
| Organization | Org and platform analytics with a read cache | Not found; **not checked** in code |
| Android, iOS | Counted server-side from API calls | None today (no third-party SDKs without owner approval); **gap to close** |
| Website, Docs | n/a | **Not checked** |

The rule is that every product supports the same provider list (web providers in every web app; the
mobile-SDK subset in Android and iOS). Today only SpaceWorks implements it; every other product's task is in
"Bring each product up to the rules" below. A statement like "no third-party trackers" is replaced by
"no third-party trackers unless the operator switches one on and the visitor consents".

---

## 9. API and mobile

**Rule.** Every endpoint is documented in OpenAPI. The same authority applies on web and native tokens.
Everything the web does is available to the apps, within the person's role.

**Why.** The apps are built from the API contract. An undocumented endpoint cannot be used safely, and a
second permission system for phones would drift.

**How to apply.**
- Document every route: request and response types, auth requirement, typed errors. Keep the snapshot in the
  repository and regenerate it and the generated client types whenever routes or models change; CI fails on
  any difference. Next.js apps publish `/api/v1/openapi.json`.
- **API reference for people, from the same spec.** Every product with an API publishes:
  - the **OpenAPI 3.1** document (JSON, and YAML where useful) at a stable URL (`/api/schema/` or
    `/api/v1/openapi.json`) and as a committed snapshot;
  - **Swagger UI** (try-it-out, at `/api/docs/` or `/docs/`) and **ReDoc** (readable reference, at `/redoc/`), both
    served from that document, both behind the same auth rules as the API (public in self-host by default, can be
    turned off in production by a setting);
  - the reference on the product's docs site too (rendered with Redocly/ReDoc), next to guides for auth, errors,
    pagination, rate limits, webhooks and versioning.
- **Spec quality.** Every operation has an `operationId` (stable, no `_2` suffixes), a summary and description, tags
  that match the areas, request/response schemas with examples, every error response (400/401/403/404/409/422/429)
  with the shared error schema, the security scheme (session, bearer, device token, API client HMAC), and
  pagination parameters. Enums are named. Breaking changes need a new version prefix (`/api/v2/`) and a note in the
  changelog.
- **Lint the spec with Redocly CLI** (`redocly lint` with the org ruleset: operationId required and unique, tags
  declared, no unused components, 4xx responses documented, examples valid) and bundle it (`redocly bundle`) for the
  docs site. In CI this runs in the contract stage (section 14) and fails on errors.
- Generated clients (TypeScript, Kotlin, Swift) come from the same snapshot; nobody hand-writes request types.
- Errors have a stable, untranslated code and a translated message, in one consistent body.
- **Throttle** abuse-prone routes. Answer **429 with `Retry-After`**; clients back off.
- **Native tokens:** device grants (App Attest on iOS, Play Integrity on Android) refuse platform-admin
  accounts, can be revoked per device and carry the same per-space authority as the browser session.
- Never cache a response that carries a one-time secret. Never put bearer values in URLs.
- Machine API clients are tenant-bound bearer identities with **explicit scopes**, minimal DTOs, rotating
  credentials, and a protected-route registry; an unknown route is denied.
- Outbound webhooks are signed (HMAC), sent only after commit, point only at public addresses (checked at save
  and at delivery), and carry minimal DTOs without personal data.
- Native apps: phone and tablet layouts, light and dark, largest text size, real offline behaviour where a
  flow needs it, push through FCM (Android) and APNs (iOS), and a server-URL entry that validates the health
  endpoint. Missing server support is shown as honestly unavailable, never faked.
- Android and iOS keep **parity**: same screens, names, flows and error copy.

**Across the org.** SpaceWorks: OpenAPI snapshot, generated client, route-coverage check, throttle tests,
device grants. Machines, Inventory, Bookings: `/api/v1/openapi.json`, API keys, signed webhooks. Events:
machine API v1 and a mobile API spec, webhooks. Workspace: bearer API tokens, integration webhooks, MCP.
Organization: OpenAPI endpoint **not found** in the tree; **not checked**. Android and iOS: generated
client from `api/openapi.json`. Swagger UI and ReDoc: SpaceWorks serves both (`/docs/`, `/redoc/`, schema at
`/schema/`) from drf-spectacular; Redocly lint is not yet in any pipeline; the Next.js apps' Swagger/ReDoc pages are
**not checked**.

---

## 10. Tenancy and privacy

**Rule.** Every record belongs to one tenant, every query is scoped to it, and public surfaces never expose
private fields.

**Why.** Forgetting a scope is a cross-tenant leak, not a bug.

**How to apply.**
- The tenant (makerspace, space, organisation, workspace) id sits on every domain row, with composite foreign
  keys to its parent. Resolve the tenant on the **server**, never from a client-sent id. Where the database
  supports it, add row-level security as a second layer.
- **Public pages never expose** storage locations, box ids, QR codes, scan history, evidence photos,
  requester history or hidden counts. Per-item switches decide what is public and what count mode (exact,
  status only, hidden) is shown.
- Hidden or unpublished things return the same 404 as things that do not exist (short links, slugs).
- Opaque, unguessable ticket, invitation, reset and certificate links; bearer capabilities are stored only as
  hashes and treated as secrets.
- Personal data is encrypted per scope; contact details never appear in public output; a new model that holds
  personal data must be classified or the build fails.
- Public names, profiles and presence follow the person's own settings; everyone else is counted, not named.
- Private storage: uploads are validated, decoded, resized, metadata-stripped and served through an
  application route with short-lived signed links.
- Personal data export and account deletion are available to every person.
- Deleting a space deletes its data and files completely, after audited steps. Archive is reversible; purge is
  not.
- Security headers, CSP nonces, trusted-proxy handling, Redis-backed fail-closed rate limits, MFA, breached
  password checks and new-device alerts are not loosened without a documented change. Never read, print or
  commit `.env` values; if a credential is exposed, rotate it.

**Across the org.** All server products: application-enforced tenant isolation. SpaceWorks adds Postgres
row-level security. Machines, Bookings, Organization state "no RLS; isolation in the application". Android and
iOS: credentials in Keychain / Android keystore only, no secrets in the repository.

---

## 11. Language, accessibility, themes and motion

**Shared guidance (1A-X02):** [Current rules](current-rules.md) resolves retained theme/visual/version conflicts; [Voice and content](voice-and-content.md) supplies the common vocabulary, state messages, localised formats and audited-action wording. These additions leave §12.1 and SW-405 as supplied.

**Rule.** Every user-facing string can be translated, every screen passes the accessibility floor in light
**and** dark, and colour, loader and motion come from the shared system.

**Why.** Hard-coded English cannot be translated and breaks plurals. Contrast and keyboard failures lock
people out.

**How to apply.**
- **Language.** Mark every string. Whole sentences with named placeholders and real plurals; never glue
  fragments. Identifiers (audit actions, error codes, module keys, enum values) and text written by a space
  are not translated. Dates and numbers use shared formatters. Regenerate catalogues with the wording. Copy
  is British English and says "Space Works"; no "Oops" and no "Something went wrong".
- **Accessibility floor.** Text 4.5:1, icons and borders 3:1, a visible keyboard focus on every control,
  44 px controls, reduced motion honoured, status always a word as well as a colour, no translucent text, full
  keyboard use. Details: [`lessons-learned.md`](lessons-learned.md).
- **Themes.** Light and dark are both designed and checked. Colours come only from the tokens
  (`tokens/tokens.json`). Staff always use the Space Works palette; tenant colours are derived for members
  only. Implementation: [`theming.md`](theming.md).
- **Loading.** One loader everywhere: the Space Works box that opens, a status label, a still version for
  reduced motion.
- **Motion.** Animate content, not chrome; transform and opacity only; nothing on the critical path longer
  than 240 ms; reduced motion turns it all off; no hover animation on touch; tenant logos never animate.
  Catalogue: [`motion.md`](motion.md).
- **Help docs with screenshots.** A change that alters what people see or do updates the in-app guide article
  and the docs in the same change, with real screenshots (light and dark where it matters). A new feature gets
  an article.

**Across the org.** SpaceWorks: translation catalogues with literal guards that must report zero. Next.js apps:
British English copy and an in-app guide (Events: MDX help with a generated index checked in CI); translation
catalogues **not found**. Android: string resources. iOS: `Localizable.xcstrings`. Design tokens are consumed by
Workspace (submodule sync), Events, Android and iOS (submodule).

---

## 12. Testing, docs and release

**Rule.** Test what a person can observe, keep the failing-test baseline at zero, never delete a test, keep
docs in step with code, bump the version on every release, and leave merging to `main` to the maintainer.

**Why.** A test that is "always red" teaches people to ignore reds. Deleted tests erase memory. Docs that lag
the code are worse than none.

**How to apply.**
- **Tests.** Test external behaviour from the product requirements. Unit tests for logic and view models, a
  database-backed integration suite on a disposable database (never a real one), browser tests for
  routing, auth and public flows, accessibility checks in both themes. Native apps: tests for every view model
  and networking core, a mock-server test for every API call used, a UI test for each phase's main flow.
- **Every change ships with its tests — no tests, no merge.** Which tests a change needs:
  - a **bug fix**: a regression test that fails before the fix and passes after it;
  - a **new endpoint or action**: the allowed case, the refused case for a role without the capability, the
    other-tenant case (must not leak), the module-off case, the typed error shapes, and the audit entry it writes;
  - a **new area/module**: on and off for the platform and per space, hidden everywhere when off, purge plan;
  - **money**: idempotent retries, webhook signature and replay, currency and minor units, refunds, provider down;
  - **web and native parity**: the same route with a web session and a native device token, same authority;
  - **a migration**: forward on a copy of real-shaped data, and backward where it is reversible;
  - **UI**: component tests for states (loading with the box loader, empty, error, success), keyboard and focus,
    both themes, reduced motion; an end-to-end test for each main flow;
  - **invariants**: a guard test that fails the build when the rule is broken (file size, module keys,
    untranslated strings, logo drawn without the shared component, colours not from tokens, stale previews);
  - **native apps**: view-model tests, a mock-server test for every API call used, a UI test per main flow;
  - **design system**: token check (site colours equal the tokens), preview freshness check, links validator.
  Tests describe behaviour a person can observe, not implementation details.
- **Zero reds.** Any failure is a new regression. Run changed and affected areas while working and the full
  suite before a release.
- **Never delete a test.** If a feature is not in this release, keep the test and skip it with a written
  reason.
- **Docs ship with code.** Docs, OpenAPI snapshot, generated client types, translation catalogues and the
  agent-instruction file are updated in the same commit as the code. Where `CLAUDE.md` and `AGENTS.md` both
  exist they must stay identical (a test or diff guards it).
- **Commits.** One logical change per commit, one-line conventional subject (`feat(area): ...`, `fix: ...`).
  Credit a co-author only on work they actually wrote.
- **Branches.** Branch from `dev`; one feature per branch where used; open a pull request into `dev`. Never
  push to `main`. **Only the maintainer (GitHub `Shaan-Shoukath`) can push to or merge into `main` and `dev`** in
  every repository: branch protection restricts both branches to that one account, applies to admins too, and
  forbids force-pushes and deletion (applied across the org on 2026-11-13). Everyone else works on feature branches
  and opens pull requests.
- **Version.** `VERSION` is raised (strictly higher than `main`) on every pull request into `main`, with a
  release note (`docs/release-<version>.md`) and the version strings updated. A release is cut by CI the first
  time a new `VERSION` reaches `main`; images are built and published by CI, not by hand.
- **Maintainer merges to `main`.** `CODEOWNERS` requests the maintainer's review on every path; branch
  protection (applied to admins too) restricts who may merge or push to `main`. Agents prepare the merge and
  stop.
- **Migrations** chain off the real latest migration, are reviewed as SQL, and never use a schema-push shortcut
  for deployable changes.
- CI required checks cover backend, contracts (OpenAPI regeneration), frontend, the rules guards and the
  version bump; a security audit workflow runs on the Next.js apps.
- Never read, print or commit secrets in tests either: use fake ids.
- **Pipelines and releases.** The full pipeline per stack (checks, version bump, release builds, signing, Pages) and
  where each repository stands is in [Pipelines, versions and releases](delivery.md).

**Across the org.** SpaceWorks: required CI checks `backend`, `contracts`, `frontend`, `rules`,
`version-bump`; `CODEOWNERS`. Events, Inventory, Workspace: CI, quality and release workflows,
`CODEOWNERS`, branches `dev` and `main`, release only on a `VERSION` change. Machines, Bookings: tests,
security-audit and release workflows, `CODEOWNERS`. Organization: tests, security audit and release workflows;
`CODEOWNERS` **not found**. Android, iOS: phase-based delivery on `dev`, CI-green rule, a pull request into
`main` merged by the owner; `CODEOWNERS` **not found**. The organisation's shared contributing guide lives in
the `.github` repository. (Some contributing text still says the old organisation name; update it to
SpaceWorks-Labs.)

### 12.1 Landing page and feature docs (every project except the native apps)

**Rule.** Every Space Works project other than the Android and iOS apps has its **own landing page** and its
**own feature docs**, built the way SpaceWorks builds them. The landing page carries the project's links — its
**GitHub repository**, releases and install, docs, licence and changelog. Landing page and docs take their
rules, palette, type, components, logo, animation and copy voice from this design system; nothing is designed
separately per project.

**Why.** A visitor meets a project on its landing page or in its docs before they ever sign in. If each project
invents its own look, the family stops reading as one and the rules drift. SpaceWorks already has the pattern
(a hub landing page with a scroll story and its GitHub link, and a docs viewer at `/docs` with a page per
area). The separate SpaceWorks-Docs site is retired, so documentation lives in each repository and changes in
the same pull request as the code (decided 13 November 2026).

**How to apply.**
- **Landing page.** Served by the project itself (on by default, switchable off like SpaceWorks'
  `HUB_LANDING_ENABLED`): hero with the project name and one-line promise, the box-mark splash and logo hover,
  the scroll-reveal story, a section per feature area, screenshots in light and dark, and the links — **GitHub
  repository**, latest release and the install one-liner, docs, licence (AGPL) and changelog — in the header
  and the footer. Built only from this system's tokens (`tokens/`), components and [motion templates](motion.md)
  (route transition, page enter, scroll reveal, theme reveal), in both themes, with reduced motion honoured.
- **Feature docs.** A docs viewer inside the project (SpaceWorks: `/docs`) with one page per feature area: what
  it does, who can use it (roles), how to switch it on or off, screenshots in both themes and the API reference
  link (rule 9). Sources live in the repository's `docs/` folder, versioned with the code; no separate docs site.
- **Native apps** (Android, iOS) have no landing page or docs of their own: they link to the SpaceWorks hub's
  landing page and docs.
- **Before shipping** a landing page or docs change: check it against the
  [new-feature checklist](#new-feature-checklist), in light and dark, at phone and desktop widths.

### 12.2 Entry points follow the data (every product)

**Rule.** Every entry point — the product's `/`, an area's home, a picker — decides what to show from what actually
exists for this visitor, and never strands them:

1. **Nothing yet → introduce.** With no items (a fresh install, an empty area) or when the backend cannot be reached,
   show the introduction: the landing page (§12.1) for `/`, a helpful empty state with the next action for an area.
2. **Exactly one → go straight to it.** Never show a list or picker with a single choice; open that item directly.
3. **Several → list.** Show the list (searchable when long), with sign in and the main action at hand.
4. **The way out is always one click away.** Wherever an entry point lands — including a single item it jumped into —
   the product's own links stay reachable: docs, source (GitHub), features, the full list and the introduction (when
   switched on), in the header, a slim product bar or menu, and the footer, without hiding the item's own navigation.
5. **Sign-in never loses the place.** If an action needs an account, sign-in or sign-up returns to the same action with
   the visitor's choices kept (item, quantity, dates, form input).
6. **Switchable introduction.** A deployment can turn the introduction off (SpaceWorks: `HUB_LANDING_ENABLED`); then
   rules 2 and 3 apply from the first visit.

| Product | Entry point and the items it counts |
|---|---|
| SpaceWorks | `/` and public makerspaces: none → landing (`/about` keeps it reachable), one → `/m/<slug>`, several → space list |
| Events | `/` and published upcoming events (or organising spaces): one → that event page, several → the list |
| Bookings | `/` and bookable spaces/rooms: one → its calendar, several → the room list |
| Inventory | `/` and public stock rooms: one → that catalogue, several → the list |
| Machines | `/` and public workshops/machine groups: one → its catalogue, several → the list |
| Organization | `/` and organisations or units open to join: one → its join page, several → the directory |
| Workspace | after sign-in, the user's workspaces: one → that workspace, several → the switcher |
| Android, iOS | after sign-in, the user's spaces: one → that space, several → the space picker (no landing in-app) |

**Why.** A fresh install has nothing to show but the product, so it introduces itself; a running deployment should open
on what people came for. A one-item list is a wasted click, a dead end loses people, and a sign-in that forgets where
you were breaks the flow.

**How to apply.** Decide from the public (or the user's) item list with a loading state first — never flash the
introduction before the answer arrives; treat a failed request like "nothing yet"; test all three cases, the link set on
every page the entry point can land on, and the sign-in return path (unit + end-to-end).

### 12.3 Product README structure (every repository)

**Rule.** Every product README follows one structure, modelled on the SpaceWorks hub README, in this order:

1. **Banner.** The rounded brand banner from `brand/readme/`, light and dark through `<picture>`
   (`prefers-color-scheme`), with descriptive alt text that says what the product is.
2. **Centred block.** The one-line promise, worded exactly as on the landing page (§12.1); badges in the brand
   colours (version, licence, CI status); quick links: **Documentation · Design system · Get started**, plus the
   landing page or live site when one exists.
3. **Intro paragraph.** What it is, who it is for, the core guarantee, the self-hosted and multi-tenant facts, and
   where it came from.
4. **A look around.** A screenshot gallery of the key screens in light and dark, each with alt text and a one-line
   caption, refreshed every release.
5. **Quickstart.** The one-line install and the requirements.
6. **Who it is for.**
7. **What you can do.** One subsection per area.
8. **Integrations.**
9. **Modules / areas.** Linking the product's modules document.
10. **Install options and Hosting.** Local, outside or hybrid per part (§2.3); release images are the frontend and the
    backend only (§2.5); the pinned infrastructure, Silo included.
11. **Architecture.** The stack and a diagram.
12. **API.** OpenAPI, Swagger UI and ReDoc links (§9).
13. **Roles and access.**
14. **Design system.** A link to the site, and the `design-system/` submodule pinned to a release tag.
15. **Documentation.** The in-repo `docs/` and the in-app docs (§12.1).
16. **Roadmap.**
17. **Contributing.** Plus the security policy, the code of conduct, and the decisions and handover files (§13).
18. **Licence.** Plus credits.

Also: no stale version and no dead link (a CI link check covers the README); screenshots in both themes; the wording
kept in step with the landing page. The native apps adapt it: store links, phone screenshots and no install one-liner.
The design-system repository itself uses the relevant subset (banner, centred block, intro, gallery, quickstart,
documentation, contributing, licence).

**Why.** The README is the front door on GitHub. One order everywhere means a reader who knows one Space Works product
can find install, hosting, API and licence in any of them, and it keeps the README, the landing page and the docs saying
the same thing.

**How to apply.** Start a new README from the SpaceWorks hub README and keep the section order; add a section only where
the product has something the list lacks, never drop one (write "Not yet" with a link to the roadmap instead). Review
the README in every release: version badge, screenshots in both themes, links, and the promise against the landing
page.

---

## 13. Decisions and handover (project memory)

**Rule.** Every repository keeps two kinds of project memory:

1. **`docs/decisions.md` — committed.** Every decision that shapes the product, its design or its process, with
   its **reason**. Numbered, dated, newest first, with an index table, a status (current, or superseded by N) and
   where it is implemented. A decision is never deleted: a later one supersedes it and both stay.
2. **A `handover/` folder — git-ignored, never committed.** It lets whoever works next (a person or an agent, on any
   machine or account) carry on without losing context:
   - `handover/CONTINUE-HERE.md` — read first: the current state (branch, what is pushed, what is uncommitted, open
     pull requests), the work in progress, and the next steps in order.
   - `handover/TODO.md` — the live checklist (`[x]` done, `[~]` in progress, `[ ]` queued).
   - optional working notes, logs and reports next to them.

**Why.** Code shows *what* was built, not *why*. Reasons that live only in chat or in someone's head are lost, and
the next person repeats old debates or undoes a deliberate choice. A handover that is updated as work happens means
a session can stop at any moment and the next one continues from the exact state.

**How to apply.**
- Ignore the folder: add `/handover/` to `.gitignore` (or `.git/info/exclude` when the ignore file must not change).
  Never put secrets, tokens or personal data in it either.
- Update `CONTINUE-HERE.md` and `TODO.md` **after every change**: each merge, push, lane or task report and
  decision. Put the newest state at the top; older blocks stay below as history.
- Record each decision in `docs/decisions.md` in the same change that implements it, with the reason. If a reason
  was never written down, write "Reason not recorded" rather than inventing one.
- Number decisions per repository; when a decision comes from another repository's ledger, keep its original
  number as a prefix (for example `SW-380`) so they can be cross-referenced.
- Agent instruction files (`CLAUDE.md` / `AGENTS.md`) point at both files so every new session reads them first.

**Across the org.** SpaceWorks: decisions ledger and handover kept in a git-ignored `handover/` folder (the
committed `docs/decisions.md` is still to add). SpaceWorks-Design-System: `docs/decisions.md` committed; handover
folder to add. Every other repository: verify, and add both.

---

## 14. CI/CD pipeline

**Rule.** Every repository has the same shape of pipeline, written as GitHub Actions workflows in the repository,
and nothing reaches `main` or a user without passing it. The full detail per stack, and where each repository
stands today, is in [Pipelines, versions and releases](delivery.md).

**Why.** A release is only as trustworthy as the checks in front of it. One pipeline shape across the org means a
contributor who knows one repository knows them all, and a gap is visible at a glance.

**The pipeline, in order.** Each stage is a separate, named job so branch protection can require it.

| Stage | What runs | When |
|---|---|---|
| 1. Lint and format | language linters, formatter check, the file-size rule (300 lines), untranslated-string guard, colour-token guard | every push and pull request |
| 2. Type check | `tsc --noEmit`, mypy/pyright where used, Kotlin and Swift compile | every push and pull request |
| 3. Unit tests | backend unit tests, frontend component tests, view-model tests on mobile | every push and pull request |
| 4. Integration tests | tests against a disposable database, cache and object store started by the job (never a shared or real one) | every push and pull request |
| 5. Contract checks | OpenAPI snapshot regenerated and diffed, `redocly lint` (org ruleset) and `redocly bundle`, generated client types up to date, webhook and event schemas | every push and pull request |
| 6. Guard tests | the invariant guards: module registry, audit, tenancy scoping, migrations graph, docs links, design tokens and previews | every push and pull request |
| 7. End-to-end | browser tests for the main flows per role, both themes, phone and desktop widths; mobile UI tests on phone and tablet | pull requests into `dev` and `main` |
| 8. Security | dependency audit (blocking on high and critical), secret scan, static analysis, container image scan | every pull request, and weekly on a schedule |
| 9. Build | production build of every artifact (images, web bundle, APK/AAB, iOS archive, static site) with no warnings | every pull request |
| 10. Version check | `VERSION` raised above `main`, release notes file present, version strings in sync | pull requests into `main` |
| 11. Release | only when a new `VERSION` reaches `main`: build multi-architecture images, sign them and the installer (cosign), attach an SBOM and provenance, create the `vX.Y.Z` tag and GitHub Release with the notes, publish `latest` last | push to `main` |
| 12. Deploy | staging first, a smoke test, then production; Pages sites deploy from `main` after the build job | after release |

**How to apply.**
- Pull request builds never publish anything; only `main` (or a manual dispatch) releases.
- Required checks on `main` and `dev`: every stage above that applies to the stack, by job name; branches must be
  up to date; admins included; only the maintainer merges to `main` (section 12).
- Cache dependencies per lockfile; pin actions to a version (or a SHA for third-party actions); give each workflow
  the least `permissions` it needs; secrets only in GitHub secrets or environments, never in logs or artifacts.
- Mobile: signing keys live in GitHub environments; release builds are signed; the APK/AAB and iOS build are
  attached to the GitHub Release (the apps ship through GitHub Releases).
- A red pipeline is fixed or the change is reverted; no "merge anyway", no skipping hooks.
- Workflow changes are reviewed like code and listed in the release notes.

**Across the org.** See the matrix and the gaps list in [Pipelines, versions and releases](delivery.md). These are
the rules to reach; they are **not yet applied** to the repositories (maintainer decision, 2026-11-13: add the
rules now, change the repositories later).

---

## New-feature checklist

1. Is it an **area** with a registry key, a default (off unless core) and an "off" behaviour (hidden, refused,
   no reports, no jobs)? Does a purge exist and keep payments?
2. Which **capability** does it need? Is every list scoped to the tenant and the role, and does the UI hide
   what the role cannot use?
3. Does every state change write an **audit entry**, go through the one workflow or availability module, and
   respect immutable evidence?
4. Is every endpoint in **OpenAPI** (shown in Swagger UI and ReDoc, passing `redocly lint`) with typed errors, throttles with `Retry-After`, and the same authority for
   web and native? Are the generated types regenerated?
5. Does money record first, in **minor units with currency**, idempotently, with webhook verification and
   Stripe, Razorpay and offline paths? Are secrets write-only and encrypted?
6. Does it add **analytics** as counts-only, tagged `client`, with any outside provider off until consent?
7. Do public pages hide private fields? Are links opaque? Is anything personal encrypted and classified?
8. Are all strings translatable, both themes checked, tokens only, loader and motion rules followed, the
   accessibility floor met?
9. Are files under **300 lines**, one responsibility each?
10. Are tests added (never deleted), the guide article and docs (with screenshots) updated, the version bumped,
    and the merge left to the maintainer?
11. Does the installer or update path still work: one-line install, backup first, rollback, and (if it adds a
    service) the hybrid and no-Redis choices?
12. Is the decision recorded in `docs/decisions.md` with its reason, and are `handover/CONTINUE-HERE.md` and
    `handover/TODO.md` updated?
13. Does the pipeline cover it (lint, types, unit, integration, contract, guards, e2e, security, build), all green?

---

## Where each product stands

> **Current rule (v2.0.1, 2026-11-13):** Observed at 2026-11-13: this is the original per-product research snapshot, not a fresh implementation audit. Consult CR-RELEASE-01 for this repository’s release/VERSION evidence and retain §12.1’s per-product landing/feature-docs rule. (1A-N38) — supersedes the line above; see [docs/current-rules.md#cr-delivery-01](current-rules.md#cr-delivery-01).

Filled from the READMEs, agent guides, file trees and docs read on 2026-11-13. "Not checked" means the
code was not read; it is not a claim either way. "n/a" means the rule does not apply to that product.

| Product | One-line install | Hybrid | Stripe | Razorpay | Analytics providers | Role views | Areas | Audit log |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SpaceWorks | Yes (GitHub Releases) | Yes: website, database, Redis, storage, email each local or outside; no-Redis mode | Yes | Yes (plus offline receipts) | All 8 web providers + Metabase + Grafana, all off by default | Yes: custom roles, area hide, narrow handover console | Yes: registry, platform and per-space | Yes: append-only, triggers |
| Workspace | Yes | Partial (task: per-part questions): Netlify split, external storage and proxy overlays; database and Redis not checked | n/a (finance records, no gateway found) | n/a | In-house analytics desk; providers not found (not checked) | Yes: OWNER/ADMIN/MEMBER/GUEST capabilities | Product areas; per-space switches not checked | Yes |
| Events | Yes (10-option menu) | Yes: Netlify split, external S3, existing proxy | Yes | Yes (plus pay at desk) | In-house; "no third-party trackers"; providers not present | Yes: org roles, co-organiser grants, staff MFA | Instance feature settings; registry not checked | Yes |
| Machines | Yes | Partial (task: per-part questions): Netlify split, no-Redis dev mode; installer questions not checked | Yes | Yes (plus cash, UPI, bank, card terminal) | In-house reports and API monitor; providers not checked | Yes: manager, type manager, operator, technician | Not checked | Yes |
| Inventory | Yes | Partial (task: per-part questions): Netlify split, external storage and proxy overlays | Yes | Yes (plus cash, bank, pay later) | In-house reports; providers not checked | Yes: ROLE_MATRIX | Not checked | Yes: append-only |
| Bookings | Yes | Partial (task: per-part questions): Netlify split, no-Redis dev mode | Yes | Yes (plus desk, UPI, bank, pay later) | In-house reports and API monitor; providers not checked | Yes: 4 roles | Not checked | Yes |
| Organization | Yes | Partial (task: per-part questions): Netlify split | Yes | Yes (plus UPI, bank, cash) | In-house org and platform analytics; providers not checked | Yes: custom OrgRoles and unit scope | Not checked | Yes |
| Android | n/a (GitHub Releases APK; owner signs) | n/a (any server URL) | Stripe Android SDK per SpaceWorks mobile spec | Not checked | None today; third-party SDKs need owner approval (gap) | Yes: permission-aware staff screens; refuses superadmin | Follows server payload | n/a (server) |
| iOS | n/a (GitHub Releases; owner signs) | n/a (any server URL) | Yes (pinned SDK) | Yes (server-selected checkout) | None today; same gap | Yes: permission-aware staff; refuses superadmin | Follows server payload | n/a (server) |
| Website | n/a (static) | n/a | n/a | n/a | Not checked | n/a | n/a | n/a |
| Docs | n/a (static) | n/a | n/a | n/a | Not checked | n/a | n/a | n/a |
| SpaceWorks-Design-System | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |

---

## Bring each product up to the rules

**Every repository:** add a committed `docs/decisions.md` and a git-ignored `handover/` folder with `CONTINUE-HERE.md` and `TODO.md` (section 13), and point the agent instruction files at them.

Every gap found while writing this page is now a **required** rule above. This is the per-product list of what
each repository must add or change. "Verify" means we have not read that code yet: check it, then either tick
it or turn it into a change. Products will be updated later; this list is the work order.

### All products

- Replace the old organisation name **SpaceWorks-HQ** with **SpaceWorks-Labs** in READMEs, `AGENTS.md` /
  `CLAUDE.md`, contributing guides, issue templates, links and badges (the `.github` repository's
  `CONTRIBUTING.md` included).
- Link this page from each README and agent guide as the rules the product follows.
- Give every project except Android and iOS its own landing page (with its GitHub, release, install and docs
  links) and its own feature docs, built from this design system ([12.1](#121-landing-page-and-feature-docs-every-project-except-the-native-apps)).
- Make every entry point follow the data: introduce when empty, open the only item directly, list several; docs,
  GitHub, features, list and introduction always one click away; sign-in returns to the same action ([12.2](#122-entry-points-follow-the-data-every-product)).
- Bring every README to the one structure: banner, centred promise with badges and quick links, intro, a look around
  in both themes, quickstart, then the remaining sections in order; native apps and the design system adapt it
  ([12.3](#123-product-readme-structure-every-repository)).

### SpaceWorks

- Already follows most rules. Verify the over-ceiling file list is current (rule 5) and that the hybrid
  installer questions cover website, database, Redis, storage and email (they do today).
- Add a server-side provider-config endpoint for the apps if one does not exist yet (see Android and iOS).

### Workspace

- **Analytics providers:** add the optional provider list (Plausible, Umami, GA4, Firebase Analytics, PostHog,
  Clarity, Sentry, Firebase Performance), all off by default, consent per purpose, route templates only,
  operator origin allow-list in the CSP, public identifiers only.
- **Hybrid:** add per-part installer questions and outside-service probes for database, Redis, file storage,
  email and website. Verify the existing Netlify split and external storage/proxy overlays against them.
- **Areas:** add an areas registry with a platform switch and a per-space switch; off hides everywhere; purge
  is separate from switch-off. Verify what `docs/areas/` already covers.
- **Audit:** add database triggers that make the audit table append-only (verify first).
- **OpenAPI:** publish an OpenAPI document for the bearer API tokens and integration routes, with a CI check.
- **i18n:** add translation catalogues and a literal-string guard.
- **Payments:** decide whether Workspace takes money at all; if it ever does, follow rule 6 (Stripe, Razorpay,
  offline receipts).
- Verify: LOC lint (present), `CODEOWNERS` (present), `client` tag on any event.

### Events

- **Analytics providers:** drop the "no third-party trackers" wording in favour of the provider list, off by
  default, with consent and the origin allow-list. Keep the in-house event analytics.
- **Hybrid:** the split layout and external S3 exist; add per-part questions and probes for database, Redis
  and email as well. Verify the existing installer questions.
- **Areas:** add the areas registry with platform and per-space switches (paid events, hackathon, mentor desk,
  member IDs and so on become areas). Verify which instance settings already act as switches.
- **Audit:** verify and add append-only database triggers.
- **OpenAPI:** extend `docs/mobile-api.openapi.yaml` to cover every route, with a CI regeneration check.
- **i18n:** add translation catalogues and a literal-string guard.
- Verify: `CODEOWNERS` (present), LOC lint (present).

### Machines

- **Analytics providers:** add the provider list as above. Verify what the API monitor and super-admin
  monitoring already cover.
- **Hybrid:** add per-part installer questions and probes; verify the Netlify split and no-Redis mode against
  them.
- **Areas:** add the registry and switches (machines, job queue, pricing and payments, repairs, consumables,
  maintenance, printers, finance). Verify what exists.
- **Audit:** verify append-only database triggers.
- **i18n:** add catalogues and a guard.
- Verify: OpenAPI covers every route (`/api/v1/openapi.json` exists), LOC lint (present), `CODEOWNERS`
  (present).

### Inventory

- **Analytics providers:** add the provider list as above.
- **Hybrid:** add per-part installer questions and probes; verify the existing external storage/proxy overlays
  and Netlify split.
- **Areas:** add the registry and switches (lending, counts, transfers, purchases, labels, importer, payments,
  webhooks). Verify what `lib/settings/sections.ts` already gives.
- **Audit:** verify append-only triggers (the README says the audit log is append-only; confirm it is
  enforced in the database).
- **i18n:** add catalogues and a guard.
- Verify: OpenAPI coverage, LOC lint (present), `CODEOWNERS` (present).

### Bookings

- **Analytics providers:** add the provider list as above.
- **Hybrid:** add per-part installer questions and probes; verify Netlify split and no-Redis mode.
- **Areas:** add the registry and switches (approvals, paid bookings, refunds, passes, repairs, reports,
  integrations). Verify what exists.
- **Audit:** verify append-only triggers.
- **i18n:** add catalogues and a guard.
- Verify: OpenAPI coverage, LOC lint (present), `CODEOWNERS` (present).

### Organization

- **Analytics providers:** add the provider list as above, beside the in-house org and platform analytics.
- **Hybrid:** add per-part installer questions and probes; verify the Netlify split.
- **Areas:** add the registry and switches (join forms, renewals, ID cards, units, receipts, payments).
- **Audit:** verify append-only triggers.
- **OpenAPI:** publish an OpenAPI document (none found) with a CI check.
- **CODEOWNERS:** add it (maintainer owns every path) and enable branch protection on `main`.
- **i18n:** add catalogues and a guard.
- Verify: LOC lint (present).

### Android

- **Analytics SDKs:** add Firebase Analytics, Crashlytics and Performance, PostHog, Sentry and Clarity, each
  inert until the deployment enables it, off by default, behind a consent screen with withdrawal, tagged
  `client: android`, no personal data, no advertising id. Read provider config from the server. Add tests
  that prove nothing starts before consent.
- **Contributor rules:** change `AGENTS.md` rule 6 (no analytics or third-party SDKs) so it **allows exactly
  these SDKs** and still forbids any other without owner approval; record it in `docs/CHANGELOG.md`.
- **Payments:** verify Razorpay support (the Stripe Android SDK is expected).
- **LOC lint:** add a 300-line check (Kotlin, tests included, generated code exempt) to CI.
- **CODEOWNERS:** add it and enable branch protection on `main`.
- **i18n:** verify string resources cover every user-facing string and add a hard-coded-string lint.
- Verify: the app refuses platform-admin accounts, parity with iOS.

### iOS

- **Analytics SDKs:** same as Android, tagged `client: ios`. Verify that no tracking identifier is used, so no
  App Tracking prompt is needed. Same consent, withdrawal and prove-it-offline tests.
- **Contributor rules:** change `AGENTS.md` rule 6 the same way.
- **LOC lint:** add a 300-line check (Swift, tests included, generated code exempt) to CI.
- **CODEOWNERS:** add it and enable branch protection on `main`.
- **i18n:** verify `Localizable.xcstrings` covers every user-facing string and add a literal-string lint.
- Verify: Razorpay and Stripe checkout both reachable from the server-selected flow, parity with Android.

### Website and Docs

> **Current rule (v2.0.1, 13 November 2026):** the separate SpaceWorks-Docs site is retired. Each project
> keeps its documentation in its own repository and serves it in its own docs viewer, beside its own landing
> page ([12.1](#121-landing-page-and-feature-docs-every-project-except-the-native-apps)). The
> Docs items below now apply to each product's in-app docs.

- **Analytics:** verify whether either loads a provider. If so, it must be off until consent and listed;
  prefer a cookie-free option (Plausible or Umami) on the operator's own origin.
- **Docs:** add pages for this rule set (hybrid per-part choices, analytics providers on web and mobile,
  areas, role views) and keep screenshots current.
- **Website:** verify the install one-liner and the area presets match each product's installer.
- Verify: `CODEOWNERS` and branch protection.

### SpaceWorks-Design-System (this repository)

- Keep this page current when a product's status changes; update the matrix above in the same commit.
- Verify the Android and iOS submodule pins, and that tokens, motion and loader files are the only inputs the
  apps consume.
