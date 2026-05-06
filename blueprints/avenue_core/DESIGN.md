# Design System Strategy: The Architectural Flow

## 1. Overview & Creative North Star
This design system is built upon the **"Architectural Flow"**—a creative North Star that treats digital space as a physical environment. Unlike traditional "flat" enterprise software that relies on boxes and lines, this system utilizes tonal depth, light-refraction, and editorial typography to create an experience that feels less like a tool and more like a curated workspace.

We move beyond the "template" look by embracing **intentional asymmetry**. Layouts should avoid rigid, centered blocks. Instead, use overlapping elements—such as a `surface_container_high` card slightly bleeding over a `primary_container` header—to create a sense of movement and professional sophistication. The goal is to make the Smart Office Platform feel intuitive, as if the UI is anticipating the user’s next move.

---

## 2. Colors & Surface Logic
The palette is a sophisticated blend of deep authority (`primary`) and organic warmth (`tertiary`). 

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are strictly prohibited** for defining sections. Boundaries must be defined solely through background color shifts. 
- Use a `surface_container_low` section sitting on a `surface` background to define a sidebar.
- Use `surface_container_highest` to highlight an active workspace against a `surface_container` background.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked sheets. 
- **Base Layer:** `surface` or `background` (#f7f9ff).
- **Secondary Content:** `surface_container_low`.
- **Primary Interaction Cards:** `surface_container_lowest` (White) to provide a "lifted" feel.
- **Nested Elements:** Use `surface_container_high` for elements *inside* a card, such as search bars or secondary lists, to create an "etched-in" look.

### The "Glass & Gradient" Rule
Floating elements (Modals, Navigation Bars, or Hover-state Tooltips) should utilize **Glassmorphism**. Apply a semi-transparent `surface` color with a 20px backdrop-blur. 
- **Signature Textures:** For high-impact CTAs, use a subtle linear gradient (45deg) transitioning from `primary` (#004d61) to `primary_container` (#1a667d). This adds a "jewel-tone" depth that feels premium and tactile.

---

## 3. Typography: Editorial Authority
We use a dual-font strategy to balance character with utility.

- **Display & Headlines (Manrope):** This is our "Editorial" voice. Manrope’s geometric yet warm proportions convey innovation. Use `display-lg` and `headline-lg` with tight letter-spacing (-0.02em) to create a bold, confident statement in headers.
- **Body & UI Labels (Inter):** Inter is our "Efficiency" voice. It provides maximum legibility for dense HR data and buffet menus.
- **Hierarchy as Identity:** Create contrast by pairing a `display-sm` headline in `on_surface` with a `label-md` uppercase sub-header in `primary`. This large scale-jump is the hallmark of high-end design.

---

## 4. Elevation & Depth
Elevation is communicated through light and tone, not just shadows.

- **Tonal Layering:** Instead of a shadow, place a `surface_container_lowest` card on a `surface_container_low` background. The subtle 2% difference in luminosity creates a sophisticated, natural lift.
- **Ambient Shadows:** When an element must float (e.g., a mobile FAB or a dropdown), use an "Ambient Shadow." 
    - **Color:** A 6% opacity tint of `on_surface` (#181c20).
    - **Blur:** Large and diffused (Y: 8px, Blur: 24px). Never use pure black shadows.
- **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use a **Ghost Border**. Apply the `outline_variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons & Interaction
- **Primary:** Gradient fill (`primary` to `primary_container`) with `on_primary` text. Corners set to `lg` (1rem) for a modern, approachable feel.
- **Secondary:** `surface_container_high` fill with `primary` text. No border.
- **Tertiary (Buffet/Appetizing):** Use `tertiary_container` with `on_tertiary_container` for actions related to food or amenities to trigger a distinct "warm" psychological response.

### Cards & Information Display
- **Rule:** Forbid divider lines.
- **Spacing:** Use vertical whitespace (24px - 32px) to separate list items. 
- **Layout:** Use `surface_container_low` for the card body and `surface_container_lowest` for a "Header" section within that card to create an inverted depth effect.

### Input Fields
- **State:** Inactive inputs use `surface_container_high`. 
- **Focus:** Transition the background to `surface_container_lowest` and apply a 2px `primary` ghost-border (20% opacity). This "glow" effect feels more innovative than a simple line change.

### Status Badges
- **Style:** Use `sm` (0.25rem) or `full` rounding. 
- **Success:** `secondary_container` background with `on_secondary_container` text.
- **Error:** `error_container` background with `on_error_container` text.
- **Tone:** Keep these "low-vibrancy." The background should be a soft pastel-like tint so the text remains the focal point for accessibility.

---

## 6. Do's and Don'ts

### Do
- **Do** use asymmetrical margins in Desktop Admin dashboards to create "white-space anchors."
- **Do** use `primary_fixed_dim` for subtle icons within headers to maintain a professional blue-teal monochromatic vibe.
- **Do** ensure all interactive touch targets on the mobile Employee Portal are at least 48px tall, even if the visual container is smaller.

### Don't
- **Don't** use 100% black (#000000) for text. Always use `on_surface` (#181c20) to maintain a premium, ink-on-paper feel.
- **Don't** use "Default" shadows. If the shadow looks like a standard CSS `drop-shadow`, it is too heavy.
- **Don't** use dividers to separate buffet menu items; use background alternating tints (`surface` vs `surface_container_low`) or simply generous padding.