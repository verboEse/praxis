## 1. Source and Download Image

- [x] 1.1 Search Pexels for spring-themed pet images (keywords: spring, cat/dog, flowers, pollen, allergies, outdoor)
- [x] 1.2 Select an image that fits the spring allergy theme and differs from February's image (pexels-sam-lion-6001168.jpg)
- [x] 1.3 Download the selected image with its original Pexels filename (e.g., pexels-photographer-imageid.jpg)
- [x] 1.4 Save the image to `/assets/images/` directory

## 2. Update Media Data

- [x] 2.1 Open `_data/media.json` and locate the end of the array
- [x] 2.2 Add a new media entry with ID 236, using the structure: `{"id": 236, "title": "<filename-without-extension>", "url": "/assets/images/<filename>", "alt": "", "caption": "", "description": ""}`
- [x] 2.3 Verify the JSON syntax is valid (proper commas, brackets)

## 3. Update March Post

- [x] 3.1 Open `posts/03-maerz.md`
- [x] 3.2 Change the `featured_media` field from `227` to `236` in the frontmatter
- [x] 3.3 Save the file

## 4. Verification

- [x] 4.1 Verify the image file exists at `/assets/images/<filename>`
- [x] 4.2 Verify `_data/media.json` is valid JSON with the new entry at ID 236
- [x] 4.3 Verify `posts/03-maerz.md` references `featured_media: 236`
- [x] 4.4 Build the site locally and confirm the March post displays the new image
