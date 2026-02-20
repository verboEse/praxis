export default function (eleventyConfig) {
  // Copy assets to output
  eleventyConfig.addPassthroughCopy("assets");

  // Copy images from _data/media URLs are already referenced
  eleventyConfig.addPassthroughCopy({ "assets/images": "assets/images" });

  // Add collections
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("posts/*.md")
      .filter(post => post.data.published !== false) // Only include published posts
      .sort((a, b) => {
        return new Date(b.data.date) - new Date(a.data.date);
      });
  });

  eleventyConfig.addCollection("pages", function (collectionApi) {
    return collectionApi.getFilteredByGlob("pages/*.md");
  });

  // Add date filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return new Date(dateObj).toISOString().split('T')[0];
  });

  // Add excerpt filter
  eleventyConfig.addFilter("excerpt", (content) => {
    const excerpt = content.substring(0, 200);
    return excerpt + (content.length > 200 ? '...' : '');
  });

  // Add basename filter for getting filename from URL
  eleventyConfig.addFilter("basename", (url) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
  });

  // Add find filter for array searching
  eleventyConfig.addFilter("find", (array, id) => {
    if (!array || !Array.isArray(array)) return null;
    return array.find(item => item.id === id);
  });

  // Add limit filter for limiting array length
  eleventyConfig.addFilter("limit", (array, limit) => {
    if (!array || !Array.isArray(array)) return [];
    return array.slice(0, limit);
  });

  // Watch for CSS changes
  eleventyConfig.addWatchTarget("assets/css/");

  // Watch for JS changes
  eleventyConfig.addWatchTarget("assets/js/");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
}
