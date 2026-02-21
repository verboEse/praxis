## Context

The website uses an 11ty static site generator with blog posts stored as markdown files in `posts/`. Each post has frontmatter metadata including a `featured_media` field that references an image ID from `_data/media.json`. 

Currently, both the February and March 2026 posts reference `featured_media: 227`, causing them to display the same featured image. The media data file contains image metadata including URLs, alt text, and responsive image markup for the site.

The March post content focuses on spring allergies in pets ("Frühjahrsallergien bei Hund, Katze & Heimtier"), so the featured image should visually align with this theme while being distinct from the February winter care theme.

## Goals / Non-Goals

**Goals:**
- Give the March post a unique featured image that aligns with the spring allergy theme
- Source the image from Pexels (free-to-use) per project requirements
- Add the new image to the project's media assets and data structures
- Maintain consistency with existing media.json structure

**Non-Goals:**
- Changing the February post's image (keep 227)
- Modifying the media.json structure or adding new fields
- Responsive image generation (use the source image as-is)
- Updating other posts or existing media entries

## Decisions

### Image Selection Criteria
Search Pexels for images related to: spring, pets/dogs/cats with allergies, flowers/pollen, veterinary care in spring. Select an image that:
- Is free to use (Pexels license)
- Visually complements the spring allergy theme
- Has good composition for a featured image (horizontal or square ratio preferred)
- Is different in subject/composition from the February image (pexels-sam-lion-6001168.jpg)

**Rationale:** The image should support the content theme while being visually distinct from adjacent monthly posts.

### Media ID Assignment
Use the next sequential ID after the current highest ID in `media.json`. Based on the current data, the highest ID is 235, so the new image will use ID 236.

**Rationale:** Maintains the existing sequential ID pattern without requiring a complex ID generation system.

### File Storage
Store the new image in `/assets/images/` with a descriptive filename from Pexels (e.g., `pexels-photographer-imageid.jpg`).

**Rationale:** Matches the existing file naming convention and keeps all images in a single assets folder for simplicity.

### Media Entry Structure
Add a minimal media.json entry with:
- `id`: 236
- `title`: filename without extension
- `url`: relative path to the image file
- `alt`: empty string (matches current entries)
- `caption`: empty string
- `description`: minimal or empty (not currently used by the template)

**Rationale:** Matches the existing minimal structure for most entries. Complex responsive markup can be added later if needed.

## Risks / Trade-offs

**Risk:** The selected image might not perfectly match the spring allergy theme  
**Mitigation:** Choose an image showing pets in a spring outdoor setting (flowers, grass) or a pet showing allergy-related behaviors

**Risk:** Media ID collision if multiple people add images simultaneously  
**Mitigation:** Low risk for this single-person project. The ID will be explicitly set to 236 in the task list.

**Trade-off:** Not generating responsive image variants (srcset)  
**Acceptance:** The existing simple entries also skip this. Can be enhanced later if site performance requires it.
