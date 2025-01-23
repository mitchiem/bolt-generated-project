const fs = require('fs').promises;
    const path = require('path');

    async function cleanPublicDirectory() {
      try {
        const publicDir = 'public';
        const files = await fs.readdir(publicDir);

        for (const file of files) {
          const filePath = path.join(publicDir, file);
          const stat = await fs.stat(filePath);
          if (stat.isFile()) {
            await fs.unlink(filePath);
          } else if (stat.isDirectory()) {
            // Optionally remove subdirectories if needed
            // await fs.rmdir(filePath, { recursive: true });
          }
        }
        console.log('Public directory cleaned.');
      } catch (error) {
        console.error('Error cleaning public directory:', error);
      }
    }


    async function generateServicePages() {
      try {
        await cleanPublicDirectory();

        const servicesData = await fs.readFile('services.json', 'utf-8');
        const services = JSON.parse(servicesData);
        const template = await fs.readFile('service-template.html', 'utf-8');

        let allServicesHTML = '';
        let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://allhourstowingmaconga.com/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
    `;
        const sitemapUrls = ['https://allhourstowingmaconga.com/'];

        for (const service of services) {
            allServicesHTML += `<a href="${service.slug}.html" class="service-card">
                                    <h3>${service.serviceName} in ${service.city}</h3>
                                    <p>${service.description}</p>
                                </a>`;
            sitemapContent += `
      <url>
        <loc>https://allhourstowingmaconga.com/${service.slug}.html</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
    `;
            sitemapUrls.push(`https://allhourstowingmaconga.com/${service.slug}.html`);
        }
        sitemapContent += `
    </urlset>
    `;

        for (const service of services) {
          const { serviceName, city, description, slug, keywords, imageUrl } = service;

          let pageContent = template;
          pageContent = pageContent.replace(/\[SERVICE_NAME\]/g, serviceName);
          pageContent = pageContent.replace(/\[SERVICE_DESCRIPTION\]/g, description);
          pageContent = pageContent.replace(/\[SERVICE_KEYWORDS\]/g, keywords.join(', '));
          pageContent = pageContent.replace(/\[SERVICE_SLUG\]/g, slug);
          pageContent = pageContent.replace(/\[ALL_SERVICES\]/g, allServicesHTML);
          pageContent = pageContent.replace(/\[SERVICE_IMAGE\]/g, imageUrl);


          const outputPath = path.join('public', `${slug}.html`);
          await fs.writeFile(outputPath, pageContent);
          console.log(`Generated ${outputPath}`);
        }
        const sitemapPath = path.join('public', 'sitemap.xml');
        await fs.writeFile(sitemapPath, sitemapContent);
        console.log('sitemap.xml generated successfully.');
        console.log('Sitemap URLs:');
        sitemapUrls.forEach(url => console.log(url));
        console.log('All service pages generated successfully.');
      } catch (error) {
        console.error('Error generating service pages:', error);
      }
    }

    generateServicePages();
