/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com'  // For Google profile pictures
    ],
  }
}

module.exports = nextConfig
