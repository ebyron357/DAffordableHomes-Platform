# Image asset register

This register records approved source imagery and the optimized repository assets used by the public site. Debra Allen's approved photographs are limited to crop, resize, compression, and format optimization; no generative fill, retouching, face replacement, beauty enhancement, or changes to her appearance are permitted.

| Role | Source filename | Final repository path | Usage |
| --- | --- | --- | --- |
| Primary About/trust photograph | `DA0EB9C5-1800-4B9B-8A09-0D7D8D18C820.jpeg` | `apps/web/public/images/debra-allen-primary-about.webp` | Homepage About Debra section |
| Secondary advisor photograph | `ED9EC101-01F5-44BD-BBEB-3DB0AD100A9D.jpeg` | `apps/web/public/images/debra-allen-advisor-desk.webp` | About page introduction |
| Supporting lifestyle photograph | `855540B8-A31A-4564-8775-1D436040F39D.jpeg` | `apps/web/public/images/debra-allen-lifestyle-full-body.webp` | About page consultation-support composition |
| Homepage family hero | Pexels photo 4868604 by Ekaterina Bolovtsova | `apps/web/public/images/black-family-moving-home-hero.webp` | Homepage hero; `object-position: 52% center` |

The hero was downloaded on 2026-07-20 from [Pexels photo 4868604](https://www.pexels.com/photo/mother-and-children-with-boxes-on-floor-4868604/). The [Pexels license](https://www.pexels.com/license/) permits free website and commercial promotional use; the site does not imply that the pictured family endorses D'Affordable Homes.

## Processing record

- Debra source attachments were mapped to the approved filenames in the order supplied with the request.
- Images were EXIF-oriented, proportionally resized, and compressed to WebP without content alteration.
- Responsive presentation uses `next/image` and focal-point-aware `object-position` values to preserve faces and natural proportions.
- Homepage hero alt text: “A Black mother and her two children packing boxes together in their home.”
- Primary Debra crop: `48% center`; desk crop: `center 38%`; full-body crop: `center 35%`.
