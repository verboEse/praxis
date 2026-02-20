import axios from 'axios';
import TurndownService from 'turndown';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

const WORDPRESS_SITE = 'https://kleintierpraxis-versmold.de';
const WP_API_BASE = `${WORDPRESS_SITE}/wp-json/wp/v2`;

// Helper function to slugify titles
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString();
}

// Helper function to create frontmatter
function createFrontmatter(data, type) {
  const frontmatter = {
    title: data.title.rendered,
    date: formatDate(data.date),
    modified: formatDate(data.modified),
    status: data.status,
    type: type,
    slug: data.slug,
  };

  if (data.excerpt && data.excerpt.rendered) {
    frontmatter.excerpt = data.excerpt.rendered.replace(/<[^>]*>/g, '').trim();
  }

  if (data.categories && data.categories.length > 0) {
    frontmatter.categories = data.categories;
  }

  if (data.tags && data.tags.length > 0) {
    frontmatter.tags = data.tags;
  }

  if (data.featured_media) {
    frontmatter.featured_media = data.featured_media;
  }

  return frontmatter;
}

// Helper function to write markdown file
function writeMarkdownFile(dir, filename, frontmatter, content) {
  const filePath = path.join(__dirname, dir, filename);

  let fileContent = '---\n';
  for (const [key, value] of Object.entries(frontmatter)) {
    if (typeof value === 'string') {
      // Escape quotes and handle multiline strings
      const escapedValue = value.replace(/"/g, '\\"').replace(/\n/g, '\\n');
      fileContent += `${key}: "${escapedValue}"\n`;
    } else if (Array.isArray(value)) {
      fileContent += `${key}:\n`;
      value.forEach(item => fileContent += `  - ${item}\n`);
    } else {
      fileContent += `${key}: ${value}\n`;
    }
  }
  fileContent += '---\n\n';
  fileContent += content;

  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`✓ Created: ${dir}/${filename}`);
}

// Fetch all pages from WordPress REST API
async function fetchAllPages(endpoint) {
  let allItems = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await axios.get(endpoint, {
        params: {
          page,
          per_page: 100,
          _embed: true
        }
      });

      allItems = allItems.concat(response.data);

      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1');
      hasMore = page < totalPages;
      page++;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // No more pages
        hasMore = false;
      } else {
        throw error;
      }
    }
  }

  return allItems;
}

// Fetch and convert posts
async function exportPosts() {
  console.log('\n📝 Fetching posts...');
  try {
    const posts = await fetchAllPages(`${WP_API_BASE}/posts`);
    console.log(`Found ${posts.length} posts`);

    for (const post of posts) {
      const content = turndownService.turndown(post.content.rendered);
      const frontmatter = createFrontmatter(post, 'post');
      const filename = `${post.slug}.md`;

      writeMarkdownFile('posts', filename, frontmatter, content);
    }
  } catch (error) {
    console.error('Error fetching posts:', error.message);
  }
}

// Fetch and convert pages
async function exportPages() {
  console.log('\n📄 Fetching pages...');
  try {
    const pages = await fetchAllPages(`${WP_API_BASE}/pages`);
    console.log(`Found ${pages.length} pages`);

    for (const page of pages) {
      const content = turndownService.turndown(page.content.rendered);
      const frontmatter = createFrontmatter(page, 'page');
      const filename = `${page.slug}.md`;

      writeMarkdownFile('pages', filename, frontmatter, content);
    }
  } catch (error) {
    console.error('Error fetching pages:', error.message);
  }
}

// Fetch media/images
async function exportMedia() {
  console.log('\n🖼️  Fetching media...');
  try {
    const media = await fetchAllPages(`${WP_API_BASE}/media`);
    console.log(`Found ${media.length} media items`);

    const mediaData = media.map(item => ({
      id: item.id,
      title: item.title.rendered,
      url: item.source_url,
      alt: item.alt_text,
      caption: item.caption.rendered,
      description: item.description.rendered
    }));

    fs.writeFileSync(
      path.join(__dirname, '_data', 'media.json'),
      JSON.stringify(mediaData, null, 2),
      'utf8'
    );
    console.log('✓ Created: _data/media.json');
  } catch (error) {
    console.error('Error fetching media:', error.message);
  }
}

// Fetch categories and tags
async function exportTaxonomies() {
  console.log('\n🏷️  Fetching taxonomies...');
  try {
    const categories = await fetchAllPages(`${WP_API_BASE}/categories`);
    const tags = await fetchAllPages(`${WP_API_BASE}/tags`);

    fs.writeFileSync(
      path.join(__dirname, '_data', 'categories.json'),
      JSON.stringify(categories, null, 2),
      'utf8'
    );
    console.log(`✓ Created: _data/categories.json (${categories.length} categories)`);

    fs.writeFileSync(
      path.join(__dirname, '_data', 'tags.json'),
      JSON.stringify(tags, null, 2),
      'utf8'
    );
    console.log(`✓ Created: _data/tags.json (${tags.length} tags)`);
  } catch (error) {
    console.error('Error fetching taxonomies:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting WordPress export from:', WORDPRESS_SITE);
  console.log('====================================\n');

  await exportPosts();
  await exportPages();
  await exportMedia();
  await exportTaxonomies();

  console.log('\n====================================');
  console.log('✅ WordPress export complete!');
  console.log('\nNext steps:');
  console.log('1. Review the generated markdown files in posts/ and pages/');
  console.log('2. Download images from _data/media.json if needed');
  console.log('3. Configure .eleventy.js');
  console.log('4. Create templates in _includes/layouts/');
}

main().catch(console.error);
