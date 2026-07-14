---
name: modern-frontend-design
description: Guidelines and best practices for creating stunning, premium, and professional user interfaces using React, Tailwind CSS v4, Framer Motion, and Lucide icons.
---
# Modern Frontend & Professional Design Guidelines

Use these principles to build premium, modern, and highly interactive interfaces that "wow" the user.

## 1. Typography & Visual Hierarchy
- Use high-quality sans-serif and display fonts (e.g., Inter and Outfit).
- Emphasize key text with weight and color gradients, avoiding harsh black `#000000` text in favor of rich slates (`text-slate-800`, `text-slate-900`).
- Ensure contrast ratios meet accessibility standards while maintaining a clean, modern aesthetic.

## 2. Premium Components & Cards
- **Hover Transitions**: Add micro-interactions (e.g. `hover:-translate-y-1 hover:shadow-xl transition-all duration-300`).
- **Borders & Shadows**: Use extremely soft borders (`border-slate-100` or `border-white/20`) and large, soft shadows (`shadow-sm`, `hover:shadow-2xl`).
- **Gradients & Backgrounds**: Utilize glassmorphism (`bg-white/70 backdrop-blur-md`) and smooth, subtle gradients.
- **Images**: Use relative containers with lazy-loading, zoom-on-hover effects (`group-hover:scale-105 transition-transform duration-500`), and dark/gradient overlays to ensure text legibility.

## 3. Form Elements & Search Bars
- Avoid default browser inputs. When using `appearance-none` on select elements, always render a custom chevron/dropdown arrow.
- Apply focus rings (`focus:ring-2 focus:ring-primary/20 focus:border-primary`) for premium keyboard navigation and active states.
- Ensure all interactive elements have hover and active states.

## 4. Layouts & Animations
- Implement staggered entry animations using `framer-motion` for lists and grids.
- Ensure layouts are fully responsive (mobile-first approach).
- Keep padding generous (`py-20`, `p-6`, `gap-8`) to give elements room to breathe.
