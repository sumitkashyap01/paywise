---
name: paywise-ui-frontend
description: >-
  Use this skill for all frontend development, UI design, component creation, styling, and architecture tasks in PayWise.
  Enforces the strict monochrome (black and white) design system, Inter typography, INR currency formatting,
  Tailwind CSS conventions, shared React Context API contract, feature guidelines, and team collaboration rules.
---

# PayWise — UI Design & Frontend Development Skill

## 1. Purpose

This document defines the shared design system, typography, UI components, styling conventions, and React architecture for PayWise.

Every team member must follow these rules when developing their assigned feature. The entire application must look and behave like one cohesive product, not four separately designed modules.

**Design direction:** Minimal, premium, monochrome, clean, and professional.

## 2. Technology Stack

Use only the following technologies:

- **Runtime:** Node.js
- **Package manager:** npm
- **Frontend:** React with JavaScript and JSX
- **Build tool:** Vite
- **State management:** React Context API and built-in React hooks
- **Styling:** Tailwind CSS
- **Data persistence:** Browser localStorage

### Do not use

- Bootstrap
- Material UI or other UI component frameworks
- Redux, Zustand, or other external state-management libraries
- Next.js or additional frontend frameworks
- TypeScript
- Unnecessary animation or icon libraries
- Additional npm packages without team approval

Use Tailwind utility classes as the default styling method. Avoid creating separate CSS files unless they are necessary for global styles or functionality that Tailwind cannot reasonably handle.

## 3. Visual Identity — Strict Black and White

PayWise must use a minimalist, monochrome interface.

**Allowed colors:** Black, white, and neutral grayscale shades.

**Forbidden:** Purple, violet, blue, green, red, orange, multicolor accents, gradients, colorful shadows, and gradient text.

Do not introduce colorful UI elements just to make a particular component stand out.

### Standard color palette

| Purpose | Tailwind class |
|---|---|
| Main page background | `bg-white` |
| Primary text | `text-black` |
| Card background | `bg-white` |
| Secondary background | `bg-neutral-50` |
| Subtle background | `bg-neutral-100` |
| Borders | `border-neutral-200` |
| Secondary text | `text-neutral-600` |
| Muted text | `text-neutral-500` |
| Primary button | `bg-black text-white` |
| Primary button hover | `hover:bg-neutral-800` |
| Secondary button | `border border-neutral-300 bg-white text-black` |
| Disabled elements | `bg-neutral-100 text-neutral-400` |
| Hover background | `hover:bg-neutral-100` |

Use grayscale consistently throughout the application.

### Color usage rules

- Use black for important actions and primary text.
- Use white as the dominant background.
- Use neutral gray for borders, secondary text, dividers, and subtle surface differences.
- Use color contrast, typography, icons, and labels to communicate status instead of status colors.
- Never use gradients, glow effects, colorful shadows, or purple accents.

For example, show an overdue payment using a black outlined badge with the label **Overdue**, not a red badge.

## 4. Typography

Use **Inter** as the application's primary font, with system font fallbacks.

```css
font-family: "Inter", -apple-system, BlinkMacSystemFont,
  "Segoe UI", sans-serif;
```

Load the font once globally. Do not import or redefine the font independently in individual components.

### Typography scale

| Element | Size | Weight |
|---|---|---|
| Main page heading | 28px | Bold |
| Section heading | 20px | Semibold |
| Card heading | 16px | Semibold |
| Body text | 14px | Regular |
| Supporting text | 12–13px | Regular |
| Button text | 14px | Medium/Semibold |
| Financial KPI | 28–32px | Bold |
| Table heading | 12px | Semibold |

Use Tailwind classes consistently:

- Page title: `text-2xl font-bold tracking-tight`
- Section title: `text-xl font-semibold tracking-tight`
- Card title: `text-base font-semibold`
- Body: `text-sm text-neutral-700`
- Supporting text: `text-xs text-neutral-500`
- Financial value: `text-3xl font-bold tracking-tight tabular-nums`

Use `tabular-nums` for financial figures when appropriate.

### Currency and dates

- Use INR throughout the application.
- Format currency consistently, for example `₹12,500.00`.
- Use the same date format throughout the app, preferably `22 Oct 2026`.
- Do not mix date or currency formats between the dashboard, transactions, and recurring payments.

## 5. Layout and Spacing

Use Tailwind's spacing scale consistently.

| Use | Class examples |
|---|---|
| Small internal gap | `gap-2` |
| Standard gap | `gap-4` |
| Section gap | `gap-6` |
| Large section gap | `gap-8` |
| Standard card padding | `p-5` |
| Compact card padding | `p-4` |
| Page padding | `p-4 sm:p-6 lg:p-8` |

### Layout rules

- Use a white main background.
- Use a fixed-width or collapsible sidebar on desktop if required by the existing design.
- Use stacked navigation on smaller screens.
- Use responsive grids for dashboard cards.
- Align page headings, filters, tables, and content panels consistently.
- Do not use unnecessary decorative sections or oversized empty hero areas.
- Avoid fixed widths that cause horizontal overflow.
- Use consistent spacing across every feature.

Suggested dashboard grid:

```jsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
  {/* Dashboard cards */}
</div>
```

## 6. Shared Component Styling

All team members must reuse the same component styles.

### Cards

```jsx
<div className="rounded-xl border border-neutral-200 bg-white p-5">
  {/* Card content */}
</div>
```

Rules:
- Use a consistent `rounded-xl` radius.
- Use subtle borders instead of colorful shadows.
- Do not use gradient backgrounds.
- Use the same internal padding for similar cards.
- Avoid excessive nested containers.

### Buttons

Use three consistent variants.

**Primary action**

```jsx
<button className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
  Add transaction
</button>
```

**Secondary action**

```jsx
<button className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-100">
  Cancel
</button>
```

**Destructive action**

Use a neutral outlined style with a clear action label and confirmation when necessary. Do not introduce red styling.

Every button must have consistent padding, typography, radius, and hover behavior.

### Inputs and forms

- Use visible labels associated with their inputs.
- Use a white background, neutral border, black text, and neutral focus states.
- Keep input heights and spacing consistent.
- Display validation errors near the relevant field.
- Use a neutral border and text treatment for errors, accompanied by clear error text.
- Do not rely on color alone for validation messages.

Example:

```jsx
<input
  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
  placeholder="Enter amount"
/>
```

### Tables and lists

- Use neutral borders and subtle row separators.
- Keep headings and row heights consistent.
- Align monetary values consistently.
- Use black for important amounts and neutral gray for supporting details.
- Use subtle grayscale hover states.
- Provide clear empty states when there is no data.

### Status badges

Use neutral backgrounds and borders for every status.

Examples:

- Paid: `border border-neutral-200 bg-neutral-100 text-neutral-700`
- Due soon: `border border-neutral-300 bg-white text-black`
- Overdue: `border border-black bg-neutral-100 text-black`

Always include the status label in text. Do not communicate status through color alone.

### Icons

Prefer simple inline SVG icons with a consistent stroke style. Use black or neutral-gray icons only.

Do not use emoji as interface icons, mix different icon styles, or add a new icon library without team approval.

## 7. Tailwind and Project Organization

Use the existing project's Tailwind setup. Do not create separate Tailwind configurations in individual feature folders.

Suggested structure:

```text
src/
├── components/
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   ├── Badge.jsx
│   └── Navbar.jsx
├── context/
│   └── FinanceContext.jsx
├── features/
│   ├── dashboard/
│   ├── transactions/
│   └── recurring/
├── utils/
│   ├── calculations.js
│   └── dates.js
├── App.jsx
└── main.jsx
```

Keep the existing project configuration when it is working. Do not independently change Tailwind versions, build settings, or shared dependencies.

### Styling rules

- Use Tailwind utility classes as the default.
- Reuse shared components rather than copying their markup and styles.
- Avoid arbitrary colors outside the agreed grayscale palette.
- Do not create conflicting global styles.
- Avoid large inline JavaScript style objects.
- Do not add gradients or introduce one-off visual styles.
- Use responsive variants such as `sm:`, `md:`, and `lg:` consistently.
- Keep class names readable; extract a shared component when repeated markup becomes difficult to maintain.

## 8. React Architecture and Context API

Use the React Context API as the single shared source of finance data.

The finance context should manage:

- `transactions`
- `recurringPayments`
- Transaction creation, updates, and deletion
- Recurring-payment creation, updates, and deletion
- The `markRecurringPaid` operation
- Persistence and loading from localStorage

Use built-in React hooks such as `useState`, `useEffect`, `useContext`, `useMemo`, and `useCallback` where appropriate.

Do not maintain independent copies of transactions or recurring payments inside individual feature pages.

### Agreed shared interface

```jsx
const {
  transactions,
  recurringPayments,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  addRecurringPayment,
  updateRecurringPayment,
  deleteRecurringPayment,
  markRecurringPaid,
} = useFinance();
```

Person 1 owns the context and must maintain the function names and argument structure agreed upon by the team.

Dashboard totals, upcoming payments, charts, and insights must derive from shared application data. Never hardcode dashboard numbers.

## 9. Feature-Specific Rules

### Dashboard

- Use a consistent grid of monochrome KPI cards.
- Clearly distinguish money already spent from upcoming commitments.
- Use simple grayscale charts with readable labels.
- Keep financial summaries concise.
- Provide an empty state for users with no recorded transactions.

### Transactions

- Reuse the shared form, input, card, and button conventions.
- Provide consistent add/edit forms and delete confirmation.
- Keep search and filters visually aligned.
- Update the dashboard when transaction data changes.
- Use actual data from the finance context.

### Recurring payments

- Follow the same form conventions as the transaction module.
- Display the title, amount, type, frequency, and next due date.
- Show Paid, Due soon, Due today, and Overdue with neutral badges.
- Ensure the Mark as Paid action records the corresponding transaction and advances the due date through the shared context operation.
- Clearly communicate that marking a payment paid records it in PayWise; it does not transfer money.

### Analytics and insights

- Reuse the dashboard's typography and card styles.
- Calculate insights from actual application data.
- Distinguish recorded expenses from estimated future commitments.
- Label potential savings as estimates.
- Never claim that a subscription is unnecessary solely because it is flagged for review.

## 10. Responsive Design

The application must remain usable on desktops, tablets, and mobile screens.

Use Tailwind responsive utilities:

```jsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {/* Responsive content */}
</div>
```

On small screens:

- Stack dashboard cards.
- Ensure forms fill the available width.
- Prevent clipped text and horizontal overflow.
- Keep controls large enough to tap.
- Adapt transaction tables to a compact list or a controlled horizontal scroll.
- Do not simply shrink the desktop layout.

## 11. Accessibility

- Use semantic HTML.
- Associate form labels with their inputs.
- Maintain visible keyboard focus.
- Use sufficient contrast between text and background.
- Use buttons for actions rather than clickable generic elements.
- Provide accessible labels for icon-only buttons.
- Do not rely on color alone to communicate errors or payment status.
- Confirm destructive actions where appropriate.

Avoid unnecessary animations. Any transitions should be subtle and functional.

## 12. Team Collaboration Rules

All four members must read and follow this skill before coding.

### Feature ownership

- **Person 1:** React setup, Context API, localStorage, global integration, and shared UI components.
- **Person 2:** Transaction management.
- **Person 3:** Recurring payments and due-date logic.
- **Person 4:** Dashboard, analytics, and insights.

### Shared-code ownership

Person 1 owns the shared design conventions and context interface. Other members should reuse them rather than redefining them.

- Do not independently edit the finance context interface.
- Do not create duplicate button, input, card, or badge components.
- Do not introduce a different color palette or typography system.
- Do not change shared dependencies without team approval.
- Do not overwrite another member's styles or component code without coordinating.
- Integrate and test modules early instead of waiting until the last few hours.

Use descriptive Git branches and commit messages. Each member should verify their feature using the actual shared application state.

## 13. Definition of Done

A feature is ready to merge when:

- It follows the monochrome black-and-white theme.
- It contains no gradients, purple accents, or unapproved colors.
- It uses Tailwind for styling.
- It follows the shared React Context API contract.
- It updates and reads the correct shared data.
- It handles empty states and invalid inputs.
- It works on desktop and mobile.
- It adds no unapproved framework or dependency.
- It does not break another feature.

## Final Rule

**Minimal design, consistent styling, shared state, and a working end-to-end flow take priority over visual effects and unnecessary complexity.**

When a decision is not covered here, follow the existing design system and choose the simplest implementation. Discuss changes to shared conventions with the team before making them.
