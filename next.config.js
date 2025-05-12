const path = require('path');
const allowedImageWordPressDomain = process.env.WORDPRESS_IMAGE_DOMAIN ? process.env.WORDPRESS_IMAGE_DOMAIN.replace(/^https?:\/\//, '') : 'glodery.com';
const nextConfig = {
  reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },
    /**
     * We specify which domains are allowed to be optimized.
     * This is needed to ensure that external urls can't be abused.
     * @see https://nextjs.org/docs/basic-features/image-optimization#domains
     */
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: allowedImageWordPressDomain,
                pathname: '/wp-content/uploads/**',
            },
            {
                protocol: 'https',
                hostname: allowedImageWordPressDomain,
                pathname: '/wp-content/uploads/**',
            },
            {
                protocol: 'http',
                hostname: 'via.placeholder.com',
                pathname: '/images/**', // Assuming a common path for placeholder images
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
                pathname: '/images/**', // Assuming a common path for placeholder images
            },
        ],
    },
};
module.exports = nextConfig
