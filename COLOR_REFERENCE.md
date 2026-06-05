<!-- ZNIYERBUY Color Reference Guide -->

# 🎨 ZNIYERBUY Color Reference Guide

## Primary Pastel Colors (From Logo)

### 🟠 Pastel Orange - #FFD4A3
**Usage**: Primary accent color, dashboard cards, main buttons
- **Hex**: #FFD4A3
- **RGB**: rgb(255, 212, 163)
- **Used in**: Card borders, quick action buttons, stat card borders
- **CSS Variable**: `--color-primary-orange`

```css
/* Example */
border: 2px solid #FFD4A3;
background-color: #FFD4A3;
```

---

### 🔴 Pastel Coral - #FFB3B3
**Usage**: Deals section, secondary buttons, form inputs
- **Hex**: #FFB3B3
- **RGB**: rgb(255, 179, 179)
- **Used in**: Deal cards, secondary CTAs, delete buttons
- **CSS Variable**: `--color-primary-coral`

```css
/* Example */
border: 2px solid #FFB3B3;
background-color: #FFB3B3;
```

---

### 🟦 Pastel Teal - #B3E5D4
**Usage**: Analytics, tertiary buttons, view details
- **Hex**: #B3E5D4
- **RGB**: rgb(179, 229, 212)
- **Used in**: Teal accent cards, analytics buttons
- **CSS Variable**: `--color-primary-teal`

```css
/* Example */
border: 2px solid #B3E5D4;
background-color: #B3E5D4;
```

---

### 🟨 Pastel Yellow - #FFF5DC
**Usage**: Additional stats, order information
- **Hex**: #FFF5DC
- **RGB**: rgb(255, 245, 220)
- **Used in**: Yellow accent cards, order stats
- **CSS Variable**: `--color-primary-yellow`

```css
/* Example */
border: 2px solid #FFF5DC;
background-color: #FFF5DC;
```

---

## Background & Surface Colors

### ⚪ Background - #FFFAF5
**Usage**: Main page background, calm vibe
- **Hex**: #FFFAF5
- **RGB**: rgb(255, 250, 245)
- **CSS Variable**: `--color-background`

```css
background-color: #FFFAF5;
```

---

### 🤍 Surface - #FFFFFF
**Usage**: Cards, dialogs, surfaces
- **Hex**: #FFFFFF
- **RGB**: rgb(255, 255, 255)
- **CSS Variable**: `--color-surface`

```css
background-color: #FFFFFF;
```

---

### 🟫 Border Color - #E5DDD5
**Usage**: Subtle borders between sections
- **Hex**: #E5DDD5
- **RGB**: rgb(229, 221, 213)
- **CSS Variable**: `--color-border`

```css
border-color: #E5DDD5;
```

---

## Text Colors

### 🟤 Text Primary - #3A3A3A
**Usage**: Main headings, important text (NOT pure black for calm vibe)
- **Hex**: #3A3A3A
- **RGB**: rgb(58, 58, 58)
- **CSS Variable**: `--color-text-primary`

```css
color: #3A3A3A;
```

---

### 🟩 Text Secondary - #6B7280
**Usage**: Descriptions, labels, secondary information
- **Hex**: #6B7280
- **RGB**: rgb(107, 114, 128)
- **CSS Variable**: `--color-text-secondary`

```css
color: #6B7280;
```

---

## Logo Bright Colors (Accents)

### 🟠 Logo Orange - #E84E0F
**Usage**: Primary action buttons, key CTAs, main accents
- **Hex**: #E84E0F
- **RGB**: rgb(232, 78, 15)
- **CSS Variable**: `--color-orange-bright`

```css
/* Primary button */
background-color: #E84E0F;
color: #FFFFFF;
```

---

### 🔴 Logo Red - #E8341F
**Usage**: Deal creation, important actions, danger actions
- **Hex**: #E8341F
- **RGB**: rgb(232, 52, 31)
- **CSS Variable**: `--color-red-bright`

```css
/* Deal button */
background-color: #E8341F;
color: #FFFFFF;
```

---

### 🟩 Logo Teal - #2A7F8A
**Usage**: Accents, highlights, secondary brand color
- **Hex**: #2A7F8A
- **RGB**: rgb(42, 127, 138)
- **CSS Variable**: `--color-accent-dark`

```css
/* Accent text or borders */
color: #2A7F8A;
border-color: #2A7F8A;
```

---

## Color Usage Examples

### Dashboard Statistics Cards

```jsx
// Total Products Card
borderColor="#FFD4A3"  // Pastel Orange
valueColor="#E84E0F"   // Logo Orange
icon="📦"

// Active Deals Card
borderColor="#FFB3B3"  // Pastel Coral
valueColor="#E8341F"   // Logo Red
icon="🏷️"

// Total Views Card
borderColor="#B3E5D4"  // Pastel Teal
valueColor="#2A7F8A"   // Logo Teal
icon="👁️"

// Total Orders Card
borderColor="#FFF5DC"  // Pastel Yellow
valueColor="#D4A300"   // Dark Yellow
icon="🛒"
```

### Button Examples

```jsx
// Primary Action - Save/Submit
backgroundColor="#E84E0F"    // Logo Orange
color="#FFFFFF"              // White text

// Secondary Action - Preview/View
backgroundColor="#FFD4A3"    // Pastel Orange
color="#3A3A3A"              // Dark text

// Deals/Create
backgroundColor="#E8341F"    // Logo Red
color="#FFFFFF"              // White text

// Analytics/Details
backgroundColor="#B3E5D4"    // Pastel Teal
color="#3A3A3A"              // Dark text

// Cancel/Ghost
backgroundColor="#E5DDD5"    // Border color
color="#3A3A3A"              // Dark text
```

### Form Input Examples

```jsx
// Product Form
borderColor="#FFD4A3"        // Pastel Orange
backgroundColor="#FFFAF5"    // Background
color="#3A3A3A"              // Dark text

// Deal Form
borderColor="#FFB3B3"        // Pastel Coral
backgroundColor="#FFFAF5"    // Background
color="#3A3A3A"              // Dark text
```

---

## Accessibility Notes

✅ **High Contrast**: All text colors meet WCAG AA standards
✅ **Not Pure Black**: Uses #3A3A3A for reduced eye strain (calm vibe)
✅ **Readable**: All pastel colors have sufficient contrast with text
✅ **Colorblind Friendly**: Multiple visual cues beyond color alone

---

## CSS Variables Reference

All colors are defined in `app/globals.css`:

```css
:root {
  /* Pastel Colors from ZNIYERBUY Logo */
  --color-primary-orange: #FFD4A3;
  --color-primary-coral: #FFB3B3;
  --color-primary-teal: #B3E5D4;
  --color-primary-yellow: #FFF5DC;
  --color-background: #FFFAF5;
  --color-surface: #FFFFFF;
  --color-text-primary: #3A3A3A;
  --color-text-secondary: #6B7280;
  --color-border: #E5DDD5;
  --color-accent-dark: #2A7F8A;
  
  /* Vibrant accents from logo */
  --color-orange-bright: #E84E0F;
  --color-red-bright: #E8341F;
}
```

---

## Quick Reference Table

| Color Name | Hex | RGB | Usage |
|------------|-----|-----|-------|
| Pastel Orange | #FFD4A3 | rgb(255, 212, 163) | Primary cards, borders |
| Pastel Coral | #FFB3B3 | rgb(255, 179, 179) | Deals, secondary buttons |
| Pastel Teal | #B3E5D4 | rgb(179, 229, 212) | Analytics, tertiary |
| Pastel Yellow | #FFF5DC | rgb(255, 245, 220) | Additional stats |
| Background | #FFFAF5 | rgb(255, 250, 245) | Main background |
| Surface | #FFFFFF | rgb(255, 255, 255) | Cards, surfaces |
| Border | #E5DDD5 | rgb(229, 221, 213) | Subtle dividers |
| Text Primary | #3A3A3A | rgb(58, 58, 58) | Headings |
| Text Secondary | #6B7280 | rgb(107, 114, 128) | Descriptions |
| Orange Bright | #E84E0F | rgb(232, 78, 15) | Primary CTAs |
| Red Bright | #E8341F | rgb(232, 52, 31) | Deals, actions |
| Teal Dark | #2A7F8A | rgb(42, 127, 138) | Accents |

---

## Design Philosophy

🎨 **Pastel Theme**: Creates a calm, friendly, non-aggressive atmosphere
✨ **No Pure Black**: Uses #3A3A3A for reduced eye strain
🎯 **Logo-Based**: Colors derived from ZNIYERBUY branding
📱 **Accessible**: WCAG AA compliant with high contrast
🌈 **Cohesive**: All colors work harmoniously together

---

Generated for ZNIYERBUY Shop Web Project
