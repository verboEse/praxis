## Why

The March blog post currently uses the same featured image as the February post (featured_media ID 227). Each monthly post should have a unique featured image to maintain visual distinction and improve user experience. This needs to be corrected now to ensure the March post has its own identity when published.

## What Changes

- Replace the featured image for the March post ([posts/03-maerz.md](posts/03-maerz.md))
- Update the `featured_media` field in the post frontmatter to reference a new, unique image
- Source and download a free-to-use image from Pexels that aligns with the March post's spring allergy theme
- Add the new image to the media assets and update the media data files accordingly

## Capabilities

### New Capabilities

No new capabilities are being introduced. This is a content update.

### Modified Capabilities

No existing capability requirements are changing. This is a content-only modification.

## Impact

**Affected files:**
- `posts/03-maerz.md` - Featured media ID will be updated
- `_data/media.json` - New media entry for the March post image
- `assets/images/` - New image file added

**Systems:**
- Static site generation (11ty) will regenerate the March post page with the new featured image
- No breaking changes or API modifications
