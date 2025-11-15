# Design System

## Color Palette

### Primary Colors
```css
--primary-500: #3b82f6  /* Main brand */
--primary-600: #2563eb  /* Hover */
```

### Semantic Colors
```css
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
--info: #06b6d4
```

### Dark Mode
```css
--dark-bg: #0a0a0a
--dark-surface: #171717
--dark-border: #262626
```

## Typography
- Font: Inter (sans), Fira Code (mono)
- Sizes: xs(12px) sm(14px) base(16px) lg(18px) xl(20px)

## Spacing
Use Tailwind's 4px grid: space-1(4px) space-2(8px) space-4(16px) space-6(24px)

## Components

### Button
```tsx
<button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md">
  Primary
</button>
```

### Card
```tsx
<div className="bg-white dark:bg-dark-surface rounded-xl shadow-md border p-6">
  Content
</div>
```

### Status Badge
```tsx
<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
  <span className="w-1.5 h-1.5 rounded-full bg-success" />
  Active
</span>
```

## Responsive Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

