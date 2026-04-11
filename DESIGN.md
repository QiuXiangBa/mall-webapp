# mall-webapp DESIGN.md

This file defines the visual and interaction direction for `mall-webapp`.

It is intended for AI coding agents and designers making UI changes in this repo.
Treat it as the design source of truth for new pages, page refreshes, and component styling decisions.

## 1. Product Context

`mall-webapp` is a mobile-first rider workbench for delivery operations.

The current product is not a marketing site and not a consumer shopping app.
It is a compact operational interface used by delivery riders to:

- log in quickly
- view assigned delivery orders
- inspect one order in detail
- execute high-confidence operational actions such as "start delivery" and "mark delivered"

Design decisions must optimize for:

- fast scanning
- status clarity
- action confidence
- thumb-friendly mobile usage
- low visual noise

Avoid decorative design that weakens readability or action speed.

## 2. Overall Visual Direction

The product should feel:

- warm
- practical
- optimistic
- reliable
- operational rather than promotional

The current visual language is:

- bright off-white background
- warm orange as the single primary brand accent
- soft cards with rounded corners
- high readability Chinese mobile UI
- light gradients used sparingly for atmosphere

The interface should feel like a lightweight delivery console with a friendly consumer-grade polish.
It should not feel corporate-dark, cyberpunk, luxury, glassmorphism-heavy, or highly gamified.

## 3. Design Principles

### 3.1 Operational First

Important information must be readable in under one second:

- order number
- fulfillment status
- delivery time window
- address
- phone number
- latest node
- next primary action

### 3.2 One Strong Accent

Use orange as the dominant brand/action color.
Do not introduce multiple competing accent colors for primary UI emphasis.

### 3.3 Calm Surfaces

Most content should sit on white cards or white cell groups over a soft warm-gray page background.
Use gradients only in page shells, hero areas, or top-level framing.

### 3.4 Mobile Reachability

Primary actions should be large, full width, and easy to tap.
Avoid tiny text buttons for core rider actions.

### 3.5 Familiar Vant Patterns

Prefer Vant-native structures for mobile interactions:

- `van-nav-bar`
- `van-cell-group`
- `van-cell`
- `van-tabs`
- `van-list`
- `van-button`
- `van-tag`
- `van-steps`
- `van-empty`
- `van-loading`

Do not reinvent controls that Vant already provides well.

## 4. Color System

These values match the current implemented direction and should remain the default baseline.

### 4.1 Core Colors

- Brand primary: `#ff6a2a`
- Brand primary soft background: `#fff2ea`
- Accent warm border: `#ece6df`
- Success: `#14b86a`
- Danger: `#ee4f4f`
- Main text: `#1f1f1f`
- Secondary text: `#353742`
- Muted text: `#7a7d89`
- Page background: `#f6f7fb`
- Card background: `#ffffff`
- Error surface: `#fef3f2`
- Error border: `#fecdca`
- Error text: `#b42318`

### 4.2 Color Usage Rules

- Use `#ff6a2a` for primary buttons, active tabs, active status emphasis, and important highlights.
- Use black or near-black text for primary information.
- Use muted gray text for supporting information, never for primary actions.
- Use green only for success semantics, not as a second brand color.
- Use red only for failures, destructive feedback, or blocked states.
- Avoid large saturated color blocks except for CTA buttons or compact status pills.

## 5. Typography

Typography should be clean, dense enough for operations, and optimized for Chinese mobile reading.

### 5.1 Font Stack

Use:

- `PingFang SC`
- `Helvetica Neue`
- `Arial`
- `sans-serif`

Do not introduce novelty display fonts.

### 5.2 Text Hierarchy

Use a small number of clear tiers:

- Kicker: small, uppercase or high-emphasis brand label
- Page title: bold, large, immediate
- Section title: medium-large, strong
- Primary row title: bold, compact
- Supporting meta: smaller and muted

### 5.3 Typography Rules

- Bold weights are acceptable for titles, statuses, and important numbers.
- Long Chinese text must wrap safely.
- Numeric identifiers like order numbers should stay visually prominent.
- Avoid overly small text for business-critical info.

## 6. Layout and Spacing

The app is mobile-first and centered within a narrow readable column.

### 6.1 Page Structure

Use this structure for most authenticated pages:

1. `van-nav-bar`
2. page body container
3. summary or hero card if needed
4. tab or filter controls if needed
5. main content card groups
6. bottom action area if an operation is required

### 6.2 Width

- Content area should remain comfortable on common phone widths.
- Existing max width around `720px` is acceptable for responsive web usage.
- Do not build wide tablet-style dashboard grids unless the feature explicitly requires it.

### 6.3 Spacing Tone

Spacing should feel breathable but compact:

- page padding: modest
- card padding: medium
- list row spacing: tight to medium
- action group spacing: clear and obvious

Avoid both cramped density and oversized luxury spacing.

## 7. Surface Style

### 7.1 Cards

Cards should be:

- white
- softly bordered
- highly rounded
- lightly elevated

Preferred card tone:

- radius around `16px` to `20px`
- soft shadow
- subtle warm border

### 7.2 Page Background

Use the soft light background as the default page canvas.
Top-left or top-area radial orange glow is acceptable as a subtle brand signature.
Do not use noisy textures, mesh gradients, or heavy blur overlays.

### 7.3 Status Pills

Status pills should be:

- compact
- rounded
- easy to scan
- mostly monochrome or orange-accented unless semantic color is required

## 8. Components

### 8.1 Nav Bar

The navigation bar should remain simple and task-focused.

- white background
- dark title text
- clear back affordance when needed
- compact right-side utility action only when justified

### 8.2 Login Screen

The login screen should feel welcoming but still operational.

- use a short brand kicker
- use a large clear title
- keep supporting text brief
- keep the form narrow and obvious
- use one strong primary submit button

Do not turn login into a multi-section promotional experience.

### 8.3 Order List

Each order item should clearly expose:

- order number
- time window
- address
- phone number
- dispatch reference
- latest node
- current fulfillment status

The order cell should feel tappable and high-confidence.
Avoid clutter such as too many badges, icons, or secondary actions inside the list row.

### 8.4 Order Detail

Order detail should follow this information order:

1. order identity and fulfillment status
2. amount or key number summary
3. recipient and delivery facts
4. next allowed action
5. delivery timeline

The action area must visually stand apart from passive data.

### 8.5 Buttons

Primary action buttons should be:

- orange
- full width when they represent the main task
- rounded
- high contrast
- visually heavier than secondary actions

Secondary actions should stay quieter and never compete with the main CTA.

### 8.6 Errors and Feedback

Errors should appear inside soft red banners or standard Vant feedback patterns.
They must be noticeable but not alarming beyond the severity of the issue.

Use:

- inline form error blocks
- top-of-content error banners
- success/fail toast for action confirmation
- confirm dialog before irreversible or state-changing rider actions

## 9. Motion and Interaction

Interaction should feel responsive and familiar, not flashy.

Allowed motion:

- subtle tab transitions
- list loading states
- standard dialog entrance
- standard route changes

Avoid:

- parallax
- long hero animations
- playful bouncing elements
- excessive skeleton choreography

## 10. Content Tone

Copy should be:

- direct
- concise
- operational
- reassuring

Use short labels and short guidance.
Prefer "what the rider should do now" over abstract system language.

Examples of good tone:

- `欢迎回来`
- `优先处理待派送订单`
- `开始配送`
- `标记已送达`
- `当前没有配送单`

Avoid:

- marketing slogans
- overly emotional microcopy
- vague system jargon

## 11. Accessibility and Usability

Always preserve:

- strong text contrast
- large tap areas
- clear loading states
- clear empty states
- explicit disabled states
- safe wrapping for long address text and order numbers

Do not rely on color alone to communicate critical status.

## 12. Implementation Rules For Coding Agents

When editing this repo:

- prefer existing Vant components before creating custom primitives
- preserve the current global token direction in `src/styles.css`
- extend existing utility classes and page shells before inventing new layout systems
- keep page backgrounds, card shapes, and orange accent consistent with current screens
- optimize for mobile portrait first

Do not:

- introduce Tailwind, UnoCSS, or a second styling framework
- add dark mode unless explicitly requested
- replace Vant interaction patterns with desktop-style controls
- import a new design language unrelated to the current orange delivery-workbench identity
- use heavy gradients, glassmorphism, or neon effects

## 13. Mapping To Current Code

The current code already establishes the desired baseline:

- global theme tokens live in `src/styles.css`
- page shell uses soft radial orange glow over light background
- white panels and card groups are the default surface treatment
- login, order list, and order detail already represent the preferred product direction

New UI should extend that direction rather than reset it.

## 14. Default Prompt Interpretation

If a request says:

- "make it better"
- "polish the page"
- "redesign this screen"
- "add a new rider page"

then interpret that as:

- keep the current orange rider-workbench identity
- keep Vant-first mobile interaction patterns
- improve hierarchy, spacing, and clarity
- make key actions more obvious
- do not transform the product into a different brand aesthetic

