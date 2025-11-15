# Mobile Responsiveness Guide

This guide covers the mobile-first responsive design patterns used throughout the application.

## Overview

The application uses a mobile-first approach where components are designed for mobile devices first, then enhanced for larger screens using Tailwind CSS breakpoints.

## Breakpoints

- **sm:** 640px - Small tablets and large phones
- **md:** 768px - Tablets and small laptops
- **lg:** 1024px - Desktop
- **xl:** 1280px - Large desktop

## Layout Patterns

### Sidebar Navigation

**Desktop (md and up):**
- Persistent sidebar visible on the left
- Fixed width: `w-64` (256px)
- Full height: `h-screen`

**Mobile (below md):**
- Sidebar hidden: `hidden md:flex`
- Mobile drawer menu accessible via menu button
- Drawer slides in from the left using shadcn Sheet component

**Implementation:**
```tsx
// Desktop sidebar
<aside className="hidden md:flex h-screen w-64 flex-col border-r bg-card">
  {/* Navigation */}
</aside>

// Mobile sidebar drawer
<Sheet>
  <SheetTrigger>
    <Button className="md:hidden">
      <Menu />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-64 p-0">
    {/* Navigation */}
  </SheetContent>
</Sheet>
```

### Main Content Area

**Desktop:**
- Content area takes remaining space after sidebar
- Padding: `px-6 lg:px-8 py-6`

**Mobile:**
- Full width: `w-full`
- Padding: `px-4 sm:px-6 py-4 sm:py-6`
- No sidebar taking space

**Implementation:**
```tsx
<main className="flex-1 overflow-auto w-full min-w-0">
  <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
    {children}
  </div>
</main>
```

## Component Patterns

### Responsive Cards

**Project Cards:**
- Mobile: Compact padding, smaller text, stacked metadata
- Desktop: Larger padding, larger text, inline metadata

**Implementation:**
```tsx
<Card className="h-full flex flex-col">
  <CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
    <CardTitle className="text-sm sm:text-base md:text-lg">
      {title}
    </CardTitle>
  </CardHeader>
  <CardContent className="px-4 sm:px-6 pb-4 sm:py-6">
    {/* Content */}
  </CardContent>
</Card>
```

### Responsive Grids

**Project List Grid:**
- Mobile: Single column
- Tablet: Two columns
- Desktop: Three columns

**Implementation:**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {projects.map(project => (
    <ProjectCard key={project.id} project={project} />
  ))}
</div>
```

### Responsive Flex Layouts

**Header Layout:**
- Mobile: Stacked vertically
- Desktop: Horizontal row

**Implementation:**
```tsx
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
  <div className="min-w-0 flex-1">
    <h1 className="text-2xl sm:text-3xl font-bold">Title</h1>
  </div>
  <Button className="w-full sm:w-auto shrink-0">
    Action
  </Button>
</div>
```

### Responsive Text

**Progressive Sizing:**
- Mobile: Smaller text (`text-xs`, `text-sm`)
- Desktop: Larger text (`text-base`, `text-lg`)

**Implementation:**
```tsx
<h1 className="text-2xl sm:text-3xl font-bold">Title</h1>
<p className="text-xs sm:text-sm text-muted-foreground">Description</p>
```

### Responsive Spacing

**Progressive Padding:**
- Mobile: `p-3` (12px)
- Tablet: `sm:p-4` (16px)
- Desktop: `md:p-6` (24px)

**Progressive Gaps:**
- Mobile: `gap-2` (8px)
- Tablet: `sm:gap-4` (16px)
- Desktop: `md:gap-6` (24px)

## Common Patterns

### Hide on Mobile / Show on Desktop
```tsx
<div className="hidden md:flex">
  {/* Desktop only */}
</div>
```

### Show on Mobile / Hide on Desktop
```tsx
<div className="md:hidden">
  {/* Mobile only */}
</div>
```

### Full Width on Mobile / Auto on Desktop
```tsx
<Button className="w-full sm:w-auto">
  Action
</Button>
```

### Stack on Mobile / Row on Desktop
```tsx
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
  {/* Content */}
</div>
```

### Truncate Long Text
```tsx
<p className="truncate">Long text that should be truncated</p>
<p className="line-clamp-2">Multi-line text limited to 2 lines</p>
```

### Prevent Overflow
```tsx
<div className="min-w-0 flex-1">
  {/* Content that might overflow */}
</div>
```

## Touch Targets

**Minimum Size:**
- Interactive elements should be at least 44x44px on mobile
- Use `h-9 w-9` (36px) minimum, prefer `h-10 w-10` (40px) or larger

**Implementation:**
```tsx
<Button size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
</Button>
```

## Mobile-Specific Features

### Mobile Sidebar Drawer
- Uses shadcn Sheet component
- Slides in from the left
- Custom close button in header
- Automatically closes on navigation
- Overlay blocks interaction with main content

### Mobile Header
- Menu button to open sidebar
- Logo next to menu button
- Smaller buttons and icons
- Compact spacing

### Mobile Forms
- Full-width inputs on mobile
- Stacked form fields
- Larger touch targets
- Mobile-optimized button sizes

## Testing

### Browser DevTools
- Use Chrome DevTools responsive mode
- Test at common breakpoints: 375px, 768px, 1024px, 1280px
- Test in portrait and landscape orientations

### Real Devices
- Test on actual mobile devices when possible
- Test on different screen sizes and orientations
- Test touch interactions and gestures

### Checklist
- [ ] All components responsive on mobile (375px)
- [ ] All components responsive on tablet (768px)
- [ ] All components responsive on desktop (1024px+)
- [ ] Touch targets are large enough (44x44px minimum)
- [ ] Text is readable on mobile (minimum 14px)
- [ ] No horizontal scrolling on mobile
- [ ] Images and media are responsive
- [ ] Forms are mobile-friendly
- [ ] Navigation is accessible on mobile
- [ ] Loading states work on mobile
- [ ] Error states work on mobile

## Best Practices

1. **Mobile-First:** Always design for mobile first, then enhance for larger screens
2. **Progressive Enhancement:** Add features for larger screens, don't remove for mobile
3. **Touch Targets:** Ensure interactive elements are at least 44x44px
4. **Text Sizing:** Use readable text sizes (minimum 14px on mobile)
5. **Spacing:** Use consistent spacing that scales with screen size
6. **Truncation:** Truncate long text to prevent layout issues
7. **Overflow:** Use `min-w-0` to prevent flex item overflow
8. **Hide Non-Essential:** Hide secondary information on mobile to save space
9. **Test Thoroughly:** Test on real devices when possible
10. **Performance:** Optimize images and assets for mobile

## Common Issues and Solutions

### Issue: Sidebar causing layout issues on mobile
**Solution:** Hide sidebar on mobile (`hidden md:flex`) and use drawer menu instead

### Issue: Text overflowing on mobile
**Solution:** Use `truncate` or `line-clamp` utilities, or `min-w-0` for flex items

### Issue: Buttons too small on mobile
**Solution:** Use larger touch targets (`h-9 w-9` minimum, prefer `h-10 w-10`)

### Issue: Forms not mobile-friendly
**Solution:** Use full-width inputs (`w-full sm:w-auto`) and stack fields (`flex-col sm:flex-row`)

### Issue: Grid layouts not responsive
**Solution:** Use responsive grid classes (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Mobile-First Design Principles](https://web.dev/responsive-web-design-basics/)
- [Touch Target Guidelines](https://web.dev/accessible-tap-targets/)
