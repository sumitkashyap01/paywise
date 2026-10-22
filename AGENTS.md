# PayWise — Agent Rules & Design System Memory

> **Skill Reference:** For the comprehensive guide, see [.agents/skills/paywise-ui-frontend/SKILL.md](file:///c:/Users/adity/OneDrive/Desktop/react%20project/paywise/.agents/skills/paywise-ui-frontend/SKILL.md).

All agents and team members working in this repository must strictly adhere to the following rules:

---

## 1. Visual Identity — Strict Monochrome (Black & White)

- **Allowed Colors:** Pure Black (`#000000`, `text-black`, `bg-black`), Pure White (`#ffffff`, `bg-white`, `text-white`), and neutral grayscale shades (`neutral-50`, `neutral-100`, `neutral-200`, `neutral-300`, `neutral-400`, `neutral-500`, `neutral-600`, `neutral-700`, `neutral-800`).
- **Strictly FORBIDDEN:** Colors (purple, violet, blue, green, red, orange, yellow), multicolor accents, gradients, colorful shadows, glow effects, or gradient text.
- **Status Communication:** Communicate status (paid, overdue, due soon, etc.) through text labels, typography, borders, and icons—NEVER color badges (e.g., use black-bordered neutral badge for "Overdue", NOT red).

---

## 2. Technology Stack & Dependencies

- **Runtime & Tools:** Node.js, npm, Vite, React (JS/JSX).
- **Styling:** Tailwind CSS (utility classes default). No arbitrary custom CSS files unless necessary for global tokens.
- **State Management:** React Context API + built-in React hooks (`useState`, `useEffect`, `useContext`, `useMemo`, `useCallback`). Browser `localStorage` for persistence.
- **Forbidden Packages:** DO NOT install or use Bootstrap, Material UI, Redux, Zustand, Next.js, TypeScript, unapproved animation/icon libraries.

---

## 3. Typography, Dates & Currency

- **Font:** Inter (`"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`).
- **Currency:** INR throughout (`₹12,500.00`).
- **Numbers:** Use `tabular-nums` for financial numbers.
- **Date format:** Uniform across all features (e.g., `22 Oct 2026`).

---

## 4. Shared React Architecture & Context Contract

All state for transactions and recurring payments lives in `FinanceContext`. Never maintain independent duplicate state in feature pages.

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

- Totals, analytics, charts, and KPI cards must derive dynamically from shared context data. Never hardcode figures.
- `markRecurringPaid`: Records transaction in PayWise and advances the due date.

---

## 5. Shared Component Patterns

- **Cards:** `rounded-xl border border-neutral-200 bg-white p-5`
- **Primary Button:** `rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800`
- **Secondary Button:** `rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-neutral-100`
- **Destructive Button:** Neutral outlined style with clear confirmation. No red buttons.
- **Inputs:** `w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black`
- **Badges:**
  - Paid: `border border-neutral-200 bg-neutral-100 text-neutral-700`
  - Due soon: `border border-neutral-300 bg-white text-black`
  - Overdue: `border border-black bg-neutral-100 text-black`
- **Icons:** Simple inline SVG with consistent monochrome stroke. No emoji as icons.

---

## 6. Team Roles

- **Person 1:** React setup, Context API, localStorage, global integration, shared UI components.
- **Person 2:** Transaction management.
- **Person 3:** Recurring payments & due-date logic.
- **Person 4:** Dashboard, analytics, & insights.

---

## 7. Definition of Done

1. Follows monochrome black & white theme (zero color/gradients).
2. Uses Tailwind CSS.
3. Complies with the shared `useFinance()` Context API contract.
4. Handles empty states and invalid inputs gracefully.
5. Fully responsive (desktop, tablet, mobile).
6. Accessible (semantic HTML, label-input bindings, visible focus states).
