# Original TECHGLOCK Image Assets

Generated with the built-in image-generation tool. Final assets are saved in public/images as WebP. No Voylla imagery is used.

## Hero

File: public/images/hero.webp

Prompt: Premium Indian jewellery ecommerce hero photograph, wide landscape. Indian woman with natural warm brown skin, dark hair in a low bun, ivory silk saree, intricate gold kundan necklace with emerald green drops and matching earrings. Subject on the right, empty pale ivory plaster wall on the left for headline copy. Natural daylight, realistic skin and gold craftsmanship. No text, logo, watermark or collage.

## Product Photography

Shared prompt: A single premium ecommerce product photograph. Complete product centered and fully visible, filling approximately 65 percent of a square canvas. Pale warm off-white matte stone background, subtle contact shadow, sharp craftsmanship, realistic metal and stones, soft diffused studio daylight. No text, logo, watermark, hands, people, props or collage.

Subjects:

- earrings.webp: Gold Indian kundan drop earrings, oval emerald green drops, tiny white stones and pearl accents.
- necklace.webp: Indian pearl heritage necklace with gold floral kundan motifs and a central pendant.
- ring.webp: Gold kundan statement ring with a large central white stone and floral halo.
- silver.webp: Sterling silver lotus flower stud earrings with sculpted petals and tiny clear stones.
- bracelet.webp: Polished gold open cuff bracelet with engraved edging.
- jhumka.webp: Traditional Indian gold bell-shaped jhumkas with green meenakari enamel and pearl fringe.
- mangalsutra.webp: Double black-bead necklace with a small curved gold pendant and clear stones.

These are illustrative catalogue images, not photographs of manufactured inventory.

## Supplied Indian Jewellery logo

`public/images/indian-jewellery-logo.png` is the original user-supplied logo.
The shared header renders it with an SVG alpha filter (`logo-background`) to hide
its near-black background against the header. The source PNG itself is unchanged;
it is not a transparent export. The artwork is cropped visually using CSS.

Built-in imagegen background-extraction attempts were discarded because they
changed the artwork and added a glow. Prompt: remove only the dark background,
preserve exact lettering, peacock and gems, and output a transparent PNG.
