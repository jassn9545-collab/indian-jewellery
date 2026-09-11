==================================================
GLOBAL JEWELLERY DESIGN SYSTEM
==================================================

IMPORTANT:
This is the GLOBAL DESIGN SYSTEM for the entire jewellery website.

Whenever creating a NEW PAGE, NEW SECTION, NEW COMPONENT, MODAL, CARD, FORM, PRODUCT PAGE, CATEGORY PAGE, COLLECTION PAGE, WEDDING PAGE, or any future UI:

ALWAYS follow this design system.

Do NOT create a different visual style for individual pages.

All new UI must look like it belongs to the same premium jewellery brand.

==================================================
1. BRAND VISUAL DIRECTION
==================================================

Overall visual language:

- Premium Indian jewellery
- Elegant
- Luxury
- Editorial
- Sophisticated
- Minimal
- Warm
- Modern
- Clean ecommerce experience

The UI should feel like a premium jewellery/fashion brand.

Use generous whitespace.

Avoid overly dense layouts.

Avoid generic SaaS UI.

Avoid futuristic/tech UI.

Avoid excessive rounded cards.

Avoid excessive animations.

Avoid visual clutter.


==================================================
2. COLOR SYSTEM
==================================================

Use CSS variables for ALL colors.

Never hardcode colors repeatedly.

Primary Emerald:
--color-primary: #0D3B2E;

Deep Emerald:
--color-primary-dark: #082C22;

Luxury Gold:
--color-gold: #C69C45;

Light Gold:
--color-gold-light: #E8D5A8;

Ivory:
--color-background: #FDFCF8;

Warm Beige:
--color-surface: #F4F0E8;

White:
--color-white: #FFFFFF;

Primary Text:
--color-text: #191919;

Secondary Text:
--color-text-secondary: #666666;

Muted Text:
--color-text-muted: #888888;

Border:
--color-border: #E7E3DA;

Success:
--color-success: #287A52;

Error:
--color-error: #B42318;


COLOR USAGE:

Emerald:
- Primary buttons
- Active states
- Important links
- Navigation active states
- Cart actions
- Primary interactive elements

Gold:
- Premium accents
- Jewellery highlights
- Decorative lines
- Small labels
- Selected premium states

Ivory:
- Main page background
- Hero background where appropriate

Warm Beige:
- Secondary sections
- Product image backgrounds
- Soft content areas

White:
- Cards
- Navigation
- Dropdowns
- Modals

IMPORTANT:

Do NOT use blue, purple, neon green, pink, or random accent colors unless explicitly requested for a specific campaign.

Do not introduce a new color for a new page.

Use the existing design system.


==================================================
3. TYPOGRAPHY SYSTEM
==================================================

Typography must remain consistent across the entire website.

Use ONLY these two font families:

DISPLAY FONT:
Cormorant Garamond

UI FONT:
Inter


--------------------------------------------------
Cormorant Garamond
--------------------------------------------------

Use for:

- Brand name
- Hero headings
- Editorial headings
- Main section headings
- Collection titles
- Campaign headings
- Luxury promotional text

Weights:

400
500
600

Typical styles:

Hero:
52–64px desktop

Section heading:
28–36px

Editorial heading:
36–52px

Mobile heading:
30–38px


--------------------------------------------------
Inter
--------------------------------------------------

Use for:

- Navbar
- Mega menu
- Buttons
- Product names
- Prices
- Category names
- Body text
- Forms
- Labels
- Badges
- Search
- Cart
- Wishlist
- Filters
- Pagination

Weights:

400
500
600

Body:
14–16px

Small text:
12–13px

Navigation:
12–13px

Product name:
14–15px

Price:
14–16px

Button:
11–12px


--------------------------------------------------
TYPOGRAPHY RULE
--------------------------------------------------

Do NOT introduce another font.

Do NOT use Cormorant Garamond for normal UI/body text.

Do NOT use Inter for major luxury/editorial headings when a serif heading is appropriate.

Maintain clear typography hierarchy.

Use CSS variables/classes for typography.


==================================================
4. FONT IMPORT
==================================================

Use Google Fonts if the existing project architecture allows it.

Required fonts:

Cormorant Garamond
Inter

Example:

@import url(
'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap'
);

If fonts are already configured in the project:

DO NOT import them again.

Reuse the existing configuration.


==================================================
5. SPACING SYSTEM
==================================================

Use a 4px spacing system.

4px
Micro spacing

8px
Icon/text spacing

12px
Small component gap

16px
Component padding

24px
Card/content gap

32px
Section internal spacing

48px
Standard section spacing

64px
Large section spacing

80px
Major editorial spacing


IMPORTANT:

Do not randomly use values such as:

13px
19px
27px
37px
53px

unless there is a strong layout reason.

Prefer the design-system spacing scale.


==================================================
6. CONTAINER SYSTEM
==================================================

Use a consistent content container across all pages.

Desktop max-width:

1280px–1400px

Preferred:

max-width: 1320px;

Width:

width: min(100% - 32px, 1320px);

Desktop horizontal padding:
24–32px

Mobile horizontal padding:
16px


Every new section should align with the same global container.

Do NOT allow different pages to have random content widths.


==================================================
7. BORDER SYSTEM
==================================================

Use:

1px solid #E7E3DA

for normal borders.

Use borders for:

- Cards
- Inputs
- Navigation separators
- Product cards
- Dropdowns
- Tables
- Filters

Avoid thick borders.

Avoid decorative borders everywhere.

Gold borders should be used very selectively.


==================================================
8. SHADOW SYSTEM
==================================================

The website should NOT rely on heavy shadows.

Preferred:

No shadow

or extremely subtle shadow only where necessary.

Cards should primarily use:

- Border
- Background
- Spacing
- Image quality

instead of large shadows.

Avoid:

large black shadows
strong floating shadows
neumorphism


==================================================
9. BORDER RADIUS
==================================================

Use restrained rounding.

Buttons:
18–22px

Small pills:
999px

Product cards:
6–10px

Images:
4–10px depending on component

Inputs:
4–8px

Modals:
8–12px

Do NOT make every component heavily rounded.


==================================================
10. BUTTON SYSTEM
==================================================

Primary Button:

Background:
#0D3B2E

Text:
#FFFFFF

Border:
none

Height:
40–46px

Padding:
16–24px

Border radius:
20px

Typography:
Inter
11–12px
600
uppercase
letter-spacing: 0.05em


Hover:

Background:
#082C22

Transform:
translateY(-1px)


Secondary Button:

Background:
transparent

Border:
1px solid #0D3B2E

Text:
#0D3B2E


Ghost Button:

Transparent background

No strong border

Text:
#191919


Buttons must remain elegant and minimal.


==================================================
11. LINK SYSTEM
==================================================

Normal link:

#191919

Hover:

#0D3B2E

Active:

#0D3B2E

Use subtle underline or color transition where appropriate.

Transition:

180ms ease


==================================================
12. CARD SYSTEM
==================================================

All new cards must follow the same visual language.

Default:

background: #FFFFFF;

border: 1px solid #E7E3DA;

border-radius: 8px;

No heavy shadow.

Cards should have:

- Clear hierarchy
- Comfortable padding
- Consistent spacing
- High-quality imagery
- Minimal UI


==================================================
13. PRODUCT CARD SYSTEM
==================================================

Every future product card must follow the same structure.

Image
↓
Wishlist
↓
Badge
↓
Product name
↓
Category
↓
Price
↓
Original price
↓
Discount
↓
Action


Product image:

Use consistent aspect ratio.

Prefer:

1:1

or

4:5

depending on the page.

Product images should use:

background:
#F4F0E8

Product hover:

transform: scale(1.03);

Transition:
180ms ease


Wishlist:
Minimal outline heart.

Active wishlist:
Emerald/gold accent.


==================================================
14. IMAGE STYLE
==================================================

All jewellery imagery should feel:

- Premium
- Editorial
- High resolution
- Natural
- Warm
- Sophisticated
- Indian luxury

Preferred backgrounds:

Ivory
Warm beige
Soft neutral
Natural lifestyle environment

Avoid:

- Low-quality images
- Over-saturated colors
- Random stock imagery
- Heavy filters
- Artificial neon lighting


For product images:

Keep jewellery centered.

Maintain consistent image ratio.

Do not stretch images.

Use:

object-fit: cover;

or

object-fit: contain;

depending on image type.


==================================================
15. ICON SYSTEM
==================================================

Use minimal outline icons.

Preferred style:

- Thin line
- Elegant
- Consistent stroke width
- Simple geometry

Use the existing icon library if already installed.

DO NOT add another icon library if an existing one is available.

Icons should generally be:

16–22px

Examples:

Search
Heart
Shopping bag
User
Chevron
Menu
Close
Arrow


==================================================
16. HEADER / NAVIGATION STYLE
==================================================

Navbar should always feel premium and minimal.

Background:
White / Ivory

Border:
1px solid #E7E3DA

Navigation typography:

Inter
12–13px
500
uppercase
letter-spacing: 0.04em

Active navigation:

Emerald text or subtle bottom border.

Do NOT create different navbar styles for different pages.


==================================================
17. SECTION HEADING SYSTEM
==================================================

Use consistent section headings.

Example:

SMALL EYEBROW

Cormorant Garamond Heading

Short supporting description


Eyebrow:

Inter
11–12px
600
uppercase
letter-spacing: 0.1em

Heading:

Cormorant Garamond
28–36px
500

Description:

Inter
14–15px
400


Use this hierarchy consistently.


==================================================
18. DECORATIVE ELEMENTS
==================================================

Luxury decorative elements should be subtle.

Allowed:

- Thin gold lines
- Small gold dots
- Small ornamental separators
- Minimal floral/jewellery-inspired marks

Do NOT overdecorate the interface.

Decorative elements should support the jewellery aesthetic, not compete with content.


==================================================
19. HOVER EFFECTS
==================================================

Use subtle interactions.

Default transition:

180ms ease

Allowed:

translateY(-1px)

scale(1.02–1.04)

color change

border-color change

background change

opacity change


Do NOT use:

bounce
spring
large scale
3D rotation
excessive parallax


==================================================
20. RESPONSIVE DESIGN
==================================================

Every new page/section MUST be responsive.

Desktop:
1280px+

Laptop:
1024–1279px

Tablet:
768–1023px

Mobile:
320–767px


Desktop-first is acceptable, but mobile MUST be intentionally designed.

Do not simply shrink desktop UI.

Mobile should have:

- Reduced spacing
- Smaller typography
- Horizontal scrolling where suitable
- 2-column product grids
- Touch-friendly controls
- Proper image crops


==================================================
21. MOBILE SPACING
==================================================

Mobile page padding:

16px

Section gap:

40–48px

Card gap:

12px

Product grid gap:

12px


Do not allow horizontal overflow.

Check:

overflow-x: hidden;

where appropriate.


==================================================
22. ACCESSIBILITY
==================================================

All future UI must follow basic accessibility standards.

Use:

- Semantic HTML
- Correct heading hierarchy
- Accessible buttons
- aria-label for icon buttons
- Keyboard navigation
- Visible focus states
- Alt text
- Sufficient text contrast


==================================================
23. DARK MODE
==================================================

If dark mode already exists in the project:

The same design system must support dark mode.

Do NOT create a completely different design.

Use CSS variables for theme colors.

Dark mode should remain:

- Elegant
- Warm
- Premium
- Low contrast glare
- Jewellery focused

Gold can remain as a premium accent.

Avoid making the dark mode pure black.


==================================================
24. ANIMATION SYSTEM
==================================================

All animations should be subtle.

Default:

transition:
background-color 180ms ease,
color 180ms ease,
border-color 180ms ease,
transform 180ms ease,
opacity 180ms ease;

No:

bounce
spring
elastic
long cinematic animations

Page transitions should not delay content visibility.


==================================================
25. FORM / INPUT SYSTEM
==================================================

For any future:

Search
Login
Signup
Checkout
Contact
Newsletter
Filter
Address

Use:

background:
#FFFFFF

border:
1px solid #E7E3DA

border-radius:
6px

height:
42–46px

font:
Inter

font-size:
14px

Focus:

border-color:
#0D3B2E

Use a subtle focus ring.

Do NOT create a different input style on each page.


==================================================
26. BADGES
==================================================

Use badges only when useful.

Examples:

NEW
BESTSELLER
SALE
PREMIUM
LIMITED

Badge style:

Inter
10–11px
600
uppercase

Keep badges small.

Primary badge:
Emerald

Premium badge:
Gold

Neutral badge:
Warm beige


==================================================
27. MODAL / DROPDOWN
==================================================

Future modals and dropdowns must use:

Background:
#FFFFFF

Border:
1px solid #E7E3DA

Border radius:
8–12px

Minimal shadow if required.

Padding:
24px

Typography:
Same global typography.

Do not introduce a new visual style.


==================================================
28. PAGE CONSISTENCY RULE
==================================================

CRITICAL:

Whenever creating a NEW PAGE or SECTION:

DO NOT redesign the global visual language.

Reuse:

- Existing color variables
- Existing typography
- Existing spacing
- Existing buttons
- Existing cards
- Existing icon style
- Existing container
- Existing border system
- Existing responsive breakpoints
- Existing animation timing

If an existing component already solves the requirement:

REUSE IT.

Do not create a duplicate component with slightly different styling.


==================================================
29. EXISTING PROJECT RULE
==================================================

Before implementing any new page or section:

1. Inspect the existing project.
2. Read the existing `requirements.txt`.
3. Check existing dependencies.
4. Check existing design tokens.
5. Check existing components.
6. Check existing CSS/theme files.
7. Reuse existing components wherever possible.
8. Do not install unnecessary packages.
9. Do not create duplicate utilities.
10. Do not overwrite existing working functionality.


==================================================
30. FINAL DESIGN PRINCIPLE
==================================================

Every new page should look like:

"Another page of the SAME premium jewellery brand."

Not:

"A completely new website."

Consistency is more important than adding new visual effects.

Always prioritize:

Premium
→ Clarity
→ Whitespace
→ Typography
→ Product imagery
→ Consistency
→ Usability
→ Performance


FINAL RULE:

If any new page/section requirement conflicts with this design system, keep the GLOBAL DESIGN SYSTEM as the default unless the requirement explicitly asks for a different visual treatment.