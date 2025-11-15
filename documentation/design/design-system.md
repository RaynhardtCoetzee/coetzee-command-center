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

## Mobile-First Design

### Layout Patterns

**Sidebar Navigation:**
- Desktop: Persistent sidebar visible on `md:` breakpoint and above
- Mobile: Hidden sidebar, accessible via drawer menu
- Pattern: `hidden md:flex` for desktop-only elements

**Mobile Drawer:**
- Uses shadcn Sheet component as left-side drawer
- Triggered by menu button in header
- Automatically closes on navigation
- Custom close button in header

**Responsive Spacing:**
- Mobile: `p-3 sm:p-4 md:p-6` - Progressive padding
- Gaps: `gap-2 sm:gap-4 md:gap-6` - Adaptive spacing
- Text: `text-xs sm:text-sm md:text-base` - Scalable typography

**Flex Layouts:**
- Stack on mobile: `flex-col sm:flex-row`
- Wrap content: `flex-wrap` for responsive wrapping
- Full width: `w-full sm:w-auto` - Mobile-first widths

**Grid Layouts:**
- Single column on mobile: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Adaptive columns based on screen size
- Consistent gaps: `gap-4` across all breakpoints

### Mobile Components

**Project Cards:**
- Compact padding on mobile: `p-3 sm:p-4`
- Smaller icons: `h-4 w-4 sm:h-5 sm:w-5`
- Responsive text: `text-sm sm:text-base md:text-lg`
- Stacked metadata on mobile

**Headers:**
- Smaller buttons on mobile: `h-8 w-8 sm:h-10 sm:w-10`
- Stacked layout on mobile: `flex-col sm:flex-row`
- Responsive logo sizes

**Forms:**
- Full width inputs on mobile: `w-full sm:w-auto`
- Stacked form fields: `flex-col sm:flex-row`
- Mobile-optimized button sizes

### Best Practices

1. **Always start with mobile design** - Mobile-first approach
2. **Use progressive enhancement** - Add features for larger screens
3. **Test on real devices** - Don't rely solely on browser dev tools
4. **Consider touch targets** - Minimum 44x44px for interactive elements
5. **Optimize images** - Use Next.js Image component with responsive sizes
6. **Handle overflow** - Use `overflow-x-auto` for horizontal scrolling when needed
7. **Truncate long text** - Use `truncate` or `line-clamp` for long content
8. **Hide non-essential content** - Use `hidden sm:block` for secondary information

