# Design System Document: The Curated Workspace

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Gallery."** 

Moving beyond the generic "SaaS template" look, this system treats every interface as a curated exhibition of information. We reject the "boxed-in" feeling of traditional dashboards. Instead, we lean into intentional asymmetry, expansive negative space, and a hierarchy driven by tonal shifts rather than structural lines. The goal is to create an environment that feels as calm and organized as a premium editorial magazine, yet as functional as a high-end productivity tool.

## 2. Colors & Surface Architecture
The palette is rooted in a "cool-lithic" foundation, using light greys and pure whites to create a sense of infinite space, punctuated by a singular, authoritative purple.

### Palette Reference
- **Primary:** `#630ed4` (Core Action)
- **Primary Container:** `#7C3AED` (Prominent Accents)
- **Surface:** `#F7F9FB` (The Canvas)
- **Surface Container Lowest:** `#FFFFFF` (Elevated Cards)
- **Surface Container High:** `#E6E8EA` (Deep Recess/Navigation)

### The "No-Line" Rule
**Standard 1px borders are strictly prohibited for sectioning.** To define boundaries, designers must use background color shifts. A section does not "end" with a line; it transitions from `surface` to `surface-container-low`. This creates a sophisticated, "Notion-esque" flow that feels boundless rather than fragmented.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of paper. 
- Use `surface-container-lowest` (#FFFFFF) for interactive elements like cards or input fields.
- Use `surface` (#F7F9FB) for the main background.
- Use `surface-container-high` (#E6E8EA) for sidebars or utility panels to create a "nested" depth that recedes from the user.

### Signature Textures
While the aesthetic is "flat," we provide visual soul through **Tonal Gradients**. For high-impact CTAs, use a subtle transition from `primary` (#630ed4) to `primary-container` (#7C3AED). This prevents the purple from appearing "plastic" and adds a level of professional polish found in premium digital products.

## 3. Typography: The Editorial Voice
We use **Manrope** exclusively. Its geometric yet approachable structure allows us to bridge the gap between "Tech" and "Lifestyle."

- **Display & Headlines:** Use `Bold (700)` or `ExtraBold (800)`. These should be oversized (`display-lg` at 3.5rem) to act as visual anchors in a sea of white space. 
- **Body Text:** Use `Light (300)` or `Regular (400)`. The light weight provides an elegant, breathable contrast against the heavy headers.
- **Labels:** Use `Medium (500)` in all-caps with a `0.05rem` letter-spacing for utility elements (e.g., table headers, small captions) to maintain authority at small scales.

## 4. Elevation & Depth
In this design system, depth is felt, not seen. We move away from traditional drop shadows in favor of **Tonal Layering**.

### The Layering Principle
Depth is achieved by "stacking" surface tiers. To make a card "pop," do not add a shadow immediately; place a `#FFFFFF` card on a `#F2F4F6` (surface-container-low) background. The contrast in hex value provides the necessary lift.

### Ambient Shadows
When an element must float (e.g., a dropdown or modal), use an **Ambient Shadow**:
- **Color:** `on-surface` (#191C1E) at 4% to 6% opacity.
- **Blur:** Large values (20px to 40px) with 0 offset. 
This mimics natural light and prevents the "dirty" look of high-contrast shadows.

### Glassmorphism & The "Ghost Border"
For floating navigation bars or overlays, use a `backdrop-blur` of 12px combined with a semi-transparent `surface` color. If a container requires a border for accessibility, use a **Ghost Border**: `outline-variant` (#CCC3D8) at **15% opacity**. It should be barely perceptible.

## 5. Components

### Buttons
- **Primary:** Solid `primary-container` (#7C3AED), White text, 10px radius (`DEFAULT`).
- **Secondary:** Solid `surface-container-highest` (#E0E3E5), `on-surface` text. No border.
- **Tertiary:** Transparent background, `primary` text. Use for low-emphasis actions.
- **Interaction:** On hover, primary buttons should shift to `primary` (#630ed4).

### Cards & Lists
- **Rule:** Forbid the use of divider lines between list items.
- **Alternative:** Use the `Spacing Scale (3)` (1rem) to create vertical gaps. In lists, use a subtle hover state shift to `surface-container-low` to indicate interactivity.
- **Shape:** All cards must utilize the `DEFAULT` (10px) border radius.

### Input Fields
- **Background:** `surface-container-lowest` (#FFFFFF).
- **Border:** Ghost Border (15% opacity `outline-variant`).
- **Focus:** 2px solid `primary-container`. The transition should be a soft fade (200ms).

### Chips & Tags
- Use `primary-fixed` (#EADDFF) for the background and `on-primary-fixed-variant` (#5A00C6) for the text. This creates a high-end, colorful "pill" look that stands out without the weight of a full button.

## 6. Do's and Don'ts

### Do:
- **Do** use asymmetrical margins. For example, give a header more top-padding than bottom-padding to create an editorial "breathing room."
- **Do** use `surface-container` shifts for layout containers rather than lines.
- **Do** embrace "Empty State" elegance. Use large typography and `surface-variant` icons.

### Don't:
- **Don't** use 100% black text. Use `on-surface` (#191C1E) to keep the contrast soft.
- **Don't** use standard 4px or 8px border radii. Stick strictly to the `10px (DEFAULT)` or `9999px (full)` for pills.
- **Don't** crowd the interface. If you feel like you need a divider, you probably just need more white space (Reference `Spacing Scale 8` or `10`).