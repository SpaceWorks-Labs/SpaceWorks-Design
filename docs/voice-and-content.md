# Voice and content

Shared writing guidance for every Space Works product, reviewed **2026-11-13**. Applies to labels, helper text, validation, feedback, notifications and in-product docs. [CR-CONTENT-01](current-rules.md#cr-content-01) records authority and the safety boundary. Existing [UX microcopy](ux-spec.md#132-microcopy-style), [confirmation rules](ux-spec.md#p30-undo-and-confirmation-behaviour-r8-r28) and [product language rules](product-rules.md#11-language-accessibility-themes-and-motion) remain available.

## Voice and tone

Be clear, warm, specific and brief. Say what happened, what it affects and what the person can do next. Address the person as “you”; describe the product as “Space Works”. Use British English: organisation, cancelled, colour, licence (noun). Sentence case applies to headings, fields, buttons and tabs; an established acronym such as QR or PDF keeps its case. Task headings and labels omit a full stop; complete explanatory sentences use one.

Warmth comes from useful help, not jokes. Discovery and empty states can be inviting. Loading and success stay quiet. Authentication, money, evidence, lost access and destructive actions use literal, calm language. Do not use “Oops”, “Something went wrong”, “just”, blame, invented certainty or an emoji to carry a result. Preserve essential consequences even when the resulting message is longer.

The examples below were read from the real product source, not invented as claims about features. The source map at the end gives file paths and line references. Proposed templates are explicitly labelled; copying a template does not establish that an operation or recovery endpoint exists.

## Vocabulary and labels

| Use | Meaning and boundary |
|---|---|
| Space Works | Product name in prose. `SpaceWorks` remains valid in repository names and code identifiers; the lowercase wordmark is artwork. |
| makerspace / space | A named space people visit or manage. Use its actual name when it disambiguates the action. Avoid “tenant” in ordinary member/staff copy. |
| Inventory | The product area. “Item” names a catalogue entry; “asset” is an individually tracked physical unit when that distinction matters. Do not call the area “Lending” merely because a historical reference does. |
| Request / handout / issue / return | Keep the task's established product label. An issue records giving items out; a return records receiving them back. Do not confuse an issue with an incident report. |
| Member / staff / organiser | Name the role or person involved. Avoid “user” where the actual role changes the consequence. |
| Bill / Receipt / Credit note | Different issued documents. A receipt is not a generic label for every financial PDF. Use the document's number after its human-readable kind. |
| Queued / recorded / failed | Queued work has not been confirmed by the server. Recorded means the operation completed. A partial failure must name the part already completed. |
| Archive / cancel / revoke / delete / refund | Distinct operations with distinct effects. Use the backend-supported operation; “delete” cannot stand in for hiding or cancelling. |

Buttons use a verb and object where needed: “Download PDF”, “Clear filters”, “Delete draft”, “Keep draft”, “Scan offline”. Avoid “OK”, “Submit” or “Yes” when the consequence can be named. An ellipsis can indicate an action opens a confirmation (“Delete draft…”); it does not replace a consequence message. Name unfamiliar icon actions and keep the accessible name aligned with the visible label. A repeated “Download PDF” action can include its document context in the accessible name, retaining those visible words.

Use the human label instead of a raw enum; never expose a feature flag, internal permission key, stack trace or secret. Keep reference numbers available as secondary context for support and audited work. Existing accessible names such as “Sign out”, “Station PIN”, “QR payload”, “Personal notifications” and “Search and commands” are deliberate contracts; update implementation and tests together if they change.

## Validation, errors and recovery

Validate a field beside the field, with its persistent label, and associate the message programmatically. Explain what to enter and preserve the entered value. A validation message is not a service-failure message. On submission with several errors, provide a summary that links to the affected fields; do not announce the same error repeatedly on every keystroke.

| Situation | Content pattern | Example and status |
|---|---|---|
| Missing/invalid value | Name the field and the valid next input; do not blame the person. | **Proposed template:** “Enter an amount with no more than {decimalPlaces} decimal places.” Derive the precision from the currency contract. |
| Incomplete safety check | Say what must be completed before continuing. | **Product:** “Check all quantities and required asset scans before continuing.” |
| Load failure | Name the resource and give a retry action that actually repeats the read. | **Product:** “Couldn't load documents. Try again.” with the available retry control. |
| Expired offline data | Name the expired resource and the recovery. | **Product:** “The offline roster expired. Download it again.” |
| Mutation partly completed | State the saved part before the failure; give recovery scoped to the remaining step. | **Product:** “Box assigned, but issue failed.” Do not say nothing changed or blindly repeat the whole handover. |
| State changed on the server | Explain the new condition and the supported alternative. | **Product:** “This draft now has sign-ups, orders or charges, so it can't be deleted. Cancel it instead.” |
| Permission/refusal | Say what is unavailable and who can help, where safe. | **Proposed template:** “You can't change {setting}. Ask {authorised role}.” Do not reveal another person's record or private existence. |

Use “Check your connection” only when connection failure is plausible evidence, not for every refusal. Show a useful server explanation in context after mapping internal identifiers; do not render arbitrary server detail as polished product copy. Keep a safe support reference available separately where one exists.

Retrying a read is different from retrying a payment, evidence upload or handover. For writes, preserve the pending state and reconcile the recorded outcome before offering a retry that could duplicate it. The message must identify uncertainty (“pending” or “couldn't confirm”) rather than falsely declaring failure or success. Copy cannot promise idempotency the API does not provide.

## Empty, filtered, loading and success states

| State | Write and do | Real product example |
|---|---|---|
| First-use empty | Say what is absent and give the next permitted step. Do not invent an Add action for a read-only role. | “No photos yet.” followed, for editors, by “Add a few so people can see the place before they book.” |
| Filtered empty | Say the filter returned nothing and offer a reset when available. Do not imply there are no records. | “No handouts match these filters.” + “Clear filters”; financial documents use “No issued documents match this filter.” |
| Loading | Use the box loader at the appropriate scale with a meaningful polite status label. Keep stable context; avoid repeated live announcements. | “Loading scanner” is the `LogoLoader` label. Reduced motion shows the still mark. |
| Background/pending | Name the work and current state. Completion is not implied by starting or queuing it. | Job tray states include “Pending”, “Queued”, “Running”, “Building” and “Promoting”. |
| Confirmed success | Name the completed action; include the result or reference when needed. Keep routine success in a polite status region without moving focus. | “Issue recorded” / “Return recorded”; password recovery says “Your password has been updated. You can now sign in.” |

Do not display zero as a substitute for unknown/loading data. Use an unavailable state for a missing amount, never “Free”. A skeleton may reserve structure where a component explicitly specifies it; it must not replace the shared loading status or imply progress. Use an accurate progress amount only when the operation supplies one.

## Offline, queued and conflict messages

Say what works locally, what still needs a connection and what will be lost if the person leaves. The actual offline check-in copy says “Offline · attendee names are encrypted on this device.” and “Keep this page open while disconnected. Closing or reloading cannot reopen it offline in this release.” Keep that limitation visible; do not generalise it into a claim that the whole product works offline.

Use a queued count and the last successful sync time where the product has them. Queueing is not attendance confirmed by the server. Name conflicts and offer the supported reconciliation; do not clear an unsynchronised warning merely because connectivity returns. **Proposed template:** “{count, plural, one {# check-in is waiting to sync} other {# check-ins are waiting to sync}}”. Translate it as one plural message, and only use it when that count is available.

## Dates, times, numbers and money

Use the shared product formatters. `lib/format.ts` uses the active language with the matching browser regional variant for dates, times, numbers and percentages. `localDateIn(timeZone)` computes today's calendar date in the space's zone. Localised display and machine-readable ISO/API/CSV values have different purposes; do not run interchange identifiers through presentation formatting.

For appointments, deadlines, receipts and audit history, give an unambiguous absolute date/time and the relevant time zone. Relative labels such as “2 min ago” may supplement that value. **Proposed display example:** “13 Nov 2026, 14:30 IST (Asia/Kolkata)”. The actual order, month name and time convention follow the active locale. Avoid ambiguous numeric-only dates such as “11/12/26” in confirmations and exports intended for people in different regions. Do not compute a space's deadline from the browser's day.

Use `formatNumber` and `formatPercent`; a percentage formatter expects a fraction (0.4 → 40%). Put units in the label or value; do not show a bare “12” where it could mean items, hours or money. Tabular figures help scan columns without changing the UI family. Do not translate an ID, QR payload, document number or code.

`lib/money.ts` formats server-computed amounts with the actual currency. Its documented examples are “€12.50” and “₹1,200.00”; an unknown currency falls back to a value plus its code. Use `formatMinorMoney` for ledger minor units so the server's currency exponent is preserved: EUR has 2 places, JPY 0 and KWD 3. Do not assume every currency has cents or reprice in the browser. `formatPrice` says “Free” only for exactly nothing owed; absent ledger data must be handled as unavailable before calling a price formatter.

Show currency where the symbol alone could be ambiguous, particularly in a confirmation or mixed-currency view. Keep negative signs and refund labels meaningful. Name the document (“Receipt”, “Credit note”, “Bill”) and preserve its number, amount/currency and issued date in the receipt/document flow.

## Plurals, localisation and inclusive wording

Translate complete sentences with named placeholders and real plural rules; do not append “s”, concatenate translated fragments or assume two plural forms. The handover source uses Lingui `plural` for issued quantities and whole messages for return summaries. “1 item” / “2 items” / “No items yet” are separate language decisions, not string arithmetic. Technical enums, audit action identifiers, module keys and space-authored text remain unchanged; translate their display labels.

Use Lingui `t`, `Trans` and plural macros (the app's existing system), regenerate catalogues and keep field labels, validation, accessible names and live-region messages translatable. A message with inline emphasis still forms one translation unit. Existing source excerpts are evidence of wording, not permission to copy fragment-based translation code.

Test long names and at least 30–50% expansion at narrow widths, plus the longest available real translation. Wrap messages and whole labels; allow buttons to grow where the component permits. Do not truncate a safety consequence, validation recovery, currency or destructive-action label. Preserve logical reading order for right-to-left locales and isolate mixed-direction codes/addresses where needed. Do not imply that an unverified locale is supported because the copy is ready for translation.

Use people’s chosen names and avoid gender, ability or technical-knowledge assumptions. Explain an uncommon term on first use. Preserve an explicit role when permissions affect the task. “Ask your Space Manager” is more useful than “Contact admin” when that role actually controls the action.

## Irreversible and audited actions

Before confirmation, name the object, consequence, retained information and any permitted alternative. The final button names the operation; the safe button says what will be kept. **Product example:** “Delete draft…” opens “Delete ‘{event title}’?”; the message says “The draft, its settings and its cover are removed. This cannot be undone.” Buttons say “Delete draft” and “Keep draft”. The surrounding copy restricts this to a draft nobody has signed up for, ordered or paid for; otherwise it directs the person to cancel.

**No generic Undo for evidence, handovers, payments or audited records.** A supported cancellation, correction, refund or reversal creates its own authorised record; it does not erase evidence or audit history. Explain that distinction before the action when it affects the person's decision. Never promise “all traces removed”, deletion of receipts or restoration of revoked access unless the product contract explicitly provides it. Only show Undo for an actually reversible operation with an existing reversal endpoint and a safe scope.

The offline-data confirmation says “The roster and any check-ins not yet synced are removed from this device. This can't be undone.” Keep **from this device** and **not yet synced**: deleting a local queue is different from cancelling recorded attendance. Put the loss warning before the final control, not only in a toast afterwards.

In a handover, keep the request, container and evidence context visible for verification. The product says “Request #{id} · Container {boxCode}. Confirm only after checking the photo and all items.” Success says “Issue recorded” or “Return recorded” and includes the request/time/evidence context. Do not add an Undo toast that bypasses that evidence workflow. For financial success, name the operation and expose the actual receipt/reference; a pending provider response must remain pending.

## Source map and review contract

Read-only source root: `<workspace>\SpaceWorks\.claude\worktrees\int-stage-r2final\frontend\src`. Observed 2026-11-13; line numbers are the inspection snapshot and may move. These are app examples, not files shipped by the design-system documentation. Paths remain code text so the built documentation does not pretend the sibling checkout is a downloadable asset.

| Example | Source relative to that root |
|---|---|
| Gallery first-use text | `components/ui/GalleryEditor.tsx:84` |
| Load error, document kinds, filtered-empty, Download PDF, amount/date | `features/payments/PaymentDocuments.tsx:11,55–70` |
| Filtered handouts, Clear filters | `features/staff/DirectLoans.tsx:200` |
| Loader label | `components/ui/ScanWorkbench.tsx:61` |
| Background state labels | `components/ui/JobTray.tsx:24` |
| Completed password change | `features/auth/LegacyPasswordResetForm.tsx:31` |
| Safety check, partial failure, confirmation and recorded results | `features/staff/handover/HandoverWizard.tsx:94–116` |
| Expiry, offline limitation, local-data loss | `features/staff/OfflineCheckInOperator.tsx:104,168–197` |
| Draft deletion restriction, refusal and confirmation | `features/staff/EventDeleteDraft.tsx:26–34` |
| Locale-aware formats and space-local day | `lib/format.ts:1–46` |
| Currency, Free, unavailable minor amount and exact minor units | `lib/money.ts:6–77` |
| Language/catalogue infrastructure | `lib/i18n.ts` |

Review content with its actual state, permission and data: populated/empty/filtered, invalid/refused/network failure, pending/offline/conflict, success/partial success, irreversible/retained evidence. Check keyboard and screen-reader announcements, long translations, narrow screens and both themes. Component Content sections should link to the relevant section here. New features need their own in-product feature article under [product rules §12.1](product-rules.md#121-landing-page-and-feature-docs-every-project-except-the-native-apps); this guide supplies writing patterns, not permission to change an API or audit policy.
