---

name: Clinical Minimalism  
colors:  
  surface: '#0f1511'  
  surface-dim: '#0f1511'  
  surface-bright: '#343b37'  
  surface-container-lowest: '#0a0f0c'  
  surface-container-low: '#171d19'  
  surface-container: '#1b211d'  
  surface-container-high: '#252b28'  
  surface-container-highest: '#303632'  
  on-surface: '#dee4de'  
  on-surface-variant: '#bccac0'  
  inverse-surface: '#dee4de'  
  inverse-on-surface: '#2c322e'  
  outline: '#87948b'  
  outline-variant: '#3d4a42'  
  surface-tint: '#68dba9'  
  primary: '#68dba9'  
  on-primary: '#003825'  
  primary-container: '#25a475'  
  on-primary-container: '#00311f'  
  inverse-primary: '#006c4a'  
  secondary: '#c8c6c5'  
  on-secondary: '#313030'  
  secondary-container: '#474746'  
  on-secondary-container: '#b7b5b4'  
  tertiary: '#ffb3ae'  
  on-tertiary: '#601214'  
  tertiary-container: '#dd706b'  
  on-tertiary-container: '#570b0e'  
  error: '#ffb4ab'  
  on-error: '#690005'  
  error-container: '#93000a'  
  on-error-container: '#ffdad6'  
  primary-fixed: '#85f8c4'  
  primary-fixed-dim: '#68dba9'  
  on-primary-fixed: '#002114'  
  on-primary-fixed-variant: '#005137'  
  secondary-fixed: '#e5e2e1'  
  secondary-fixed-dim: '#c8c6c5'  
  on-secondary-fixed: '#1c1b1b'  
  on-secondary-fixed-variant: '#474746'  
  tertiary-fixed: '#ffdad7'  
  tertiary-fixed-dim: '#ffb3ae'  
  on-tertiary-fixed: '#410004'  
  on-tertiary-fixed-variant: '#7f2928'  
  background: '#0f1511'  
  on-background: '#dee4de'  
  surface-variant: '#303632'  
typography:  
  h1:  
    fontFamily: Manrope  
    fontSize: 32px  
    fontWeight: '700'  
    lineHeight: '1.2'  
    letterSpacing: -0.02em  
  h2:  
    fontFamily: Manrope  
    fontSize: 24px  
    fontWeight: '600'  
    lineHeight: '1.3'  
    letterSpacing: -0.01em  
  h3:  
    fontFamily: Manrope  
    fontSize: 20px  
    fontWeight: '600'  
    lineHeight: '1.4'  
    letterSpacing: '0'  
  body-lg:  
    fontFamily: Inter  
    fontSize: 16px  
    fontWeight: '400'  
    lineHeight: '1.6'  
    letterSpacing: '0'  
  body-sm:  
    fontFamily: Inter  
    fontSize: 14px  
    fontWeight: '400'  
    lineHeight: '1.5'  
    letterSpacing: '0'  
  label-caps:  
    fontFamily: Inter  
    fontSize: 12px  
    fontWeight: '600'  
    lineHeight: '1'  
    letterSpacing: 0.05em  
  mono-data:  
    fontFamily: Inter  
    fontSize: 14px  
    fontWeight: '500'  
    lineHeight: '1'  
    letterSpacing: -0.01em  
rounded:  
  sm: 0.125rem  
  DEFAULT: 0.25rem  
  md: 0.375rem  
  lg: 0.5rem  
  xl: 0.75rem  
  full: 9999px  
spacing:  
  unit: 4px  
  xs: 4px  
  sm: 8px  
  md: 16px  
  lg: 24px  
  xl: 40px  
  container-padding: 20px

##   gutter: 12px

## Brand & Style

This design system is engineered for a premium metabolic health experience, prioritizing data density, clarity, and a "medical-grade" aesthetic. The brand personality is disciplined, authoritative, and sophisticated, evoking the feeling of a high-end laboratory instrument or a professional surgical interface.

The visual style follows a strict **Flat and Framed** philosophy. It avoids the trend of soft shadows and organic shapes in favor of precise, technical layouts. Every element is contained within structural frames, utilizing subtle borders to define hierarchy rather than depth. The aesthetic is "Clinical Minimalism"—where every pixel serves a functional purpose, ensuring that complex metabolic data remains the focus.

## Colors

The palette is rooted in a "Deep Charcoal" ecosystem to reduce eye strain and emphasize the vibrant primary accent. 

- **Background:** The base layer is a singular #0a0a0a, providing a void-like depth that makes content appear more luminescent.
- **Surface:** Elevated containers use #1a1a1a. These are never defined by shadows, only by their #333333 1px borders.
- **Primary Accent:** #059669 (Emerald) is used sparingly for critical actions, metabolic "success" states, and active data points.
- **Typography:** High-contrast off-white (#f9fafb) is reserved for primary information, while a muted light gray (#9ca3af) is used for labels and secondary metadata to maintain a clear information hierarchy.

## Typography

This design system utilizes a dual-font strategy to balance modern elegance with technical utility. 

**Manrope** is used for all headlines. Its geometric yet refined construction provides a premium feel. Headlines should use tighter letter-spacing to maintain a "locked-in" technical appearance.

**Inter** is the workhorse for body text, data points, and labels. Its high x-height ensures maximum readability for clinical metrics. For data visualization and small labels, uppercase styling with slight tracking (letter-spacing) should be applied to evoke a dashboard/instrumental feel.

## Layout & Spacing

The layout philosophy is based on a **Fixed Grid** within a framed container system. A strict 4px baseline grid governs all vertical rhythm.

- **Grid:** A 12-column grid is used for desktop/tablet, while a 4-column grid is used for mobile.
- **Framing:** Instead of open whitespace, use 1px #333333 borders to create "cells" for different data clusters. 
- **Rhythm:** Generous internal padding (md/16px) within cards prevents the technical aesthetic from feeling cramped, while tight external gutters (12px) maintain the "instrument cluster" look.

## Elevation & Depth

This system intentionally rejects physical metaphors like shadows and blurs. Depth is conveyed exclusively through **Tonal Layering and Outlines**:

1. **Level 0 (Base):** #0a0a0a - The main canvas.
2. **Level 1 (Surface):** #1a1a1a - Cards, navigation bars, and modals.
3. **Level 2 (Interaction):** #333333 - Strokes, dividers, and inactive state borders.

To indicate "hover" or "active" states, the system uses a color shift in the border (moving from #333333 to #059669) rather than increasing shadow or brightness. This maintains the flat, clinical integrity of the interface.

## Shapes

The shape language is "Soft-Technical." By choosing a low roundedness (0.25rem / 4px), the system avoids the "friendliness" of consumer apps and leans into the precision of professional software.

- **Primary Corner Radius:** 4px for all buttons, cards, and input fields.
- **Large Components:** 8px (rounded-lg) for main container wraps or modals.
- **Icons:** Should be stroke-based (1.5px or 2px weight) with squared-off ends to match the tight corner radii of the UI.

## Components

**Buttons**  
Buttons are strictly flat. The Primary Button uses a solid #059669 background with #f9fafb text. Secondary buttons use a #1a1a1a background with a 1px #333333 border. No gradients.

**Cards & Framing**  
Cards must have a 1px border (#333333). Titles within cards should be set in `label-caps` to act as a header for the data below.

**Inputs & Fields**  
Text inputs use the Surface color (#1a1a1a) with a #333333 border. Upon focus, the border transitions to the Primary Emerald (#059669). Labels sit above the field in `body-sm` muted gray.

**Data Strips (Lists)**  
For metabolic metrics (e.g., Glucose, Heart Rate), use "Data Strips"—horizontal rows with a 1px bottom border. This creates a ledger-like appearance that is easy to scan.

**Technical Chips**  
Small, rectangular chips with 2px radius. Used for tagging "Fasted," "Post-Prandial," or "Keto." Backgrounds should be transparent with a colored border and text to indicate status.

**Metabolic Graphs**  
Charts should use the Primary Emerald for data lines. Grid lines within the charts must use #333333 at 0.5px thickness to maintain the clinical, precise aesthetic.