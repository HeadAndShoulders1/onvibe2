const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './i18n.ts'
);
const webpack = require('webpack');
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
      serverActions: true
  },
  reactStrictMode: true,
  webpack(config) {
    config.output.publicPath = "/_next/";
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.FLUENTFFMPEG_COV': JSON.stringify(false)
      })
    );
    return config;
  },
  reactStrictMode: true,
  images: {
    domains: ['onvibe.hb.ru-msk.vkcs.cloud'],
  },
};

module.exports = withNextIntl({
  ...nextConfig
});
