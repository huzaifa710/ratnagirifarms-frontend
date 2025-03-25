/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ratnagirifarms.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  // Add these configurations
  priority: 0.7,
  changefreq: 'daily',
  transform: async (config, path) => {
    // Set highest priority for homepage
    const priority = path === '/' ? 1.0 : 
                    path.includes('/product') ? 0.8 : 
                    0.5;
                    
    // Return object
    return {
      loc: path,
      changefreq: path === '/' ? 'daily' : 'weekly',
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};