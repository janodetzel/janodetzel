import { siteConfig } from './lib/site-config'

export const pages = {
  home: {
    title: 'Home',
    pageId: 'd7e1dc5a47b749df84a580ba2591cd1c',
    url: '/'
  },
  blog: {
    title: 'Blog',
    pageId: '0ac96f92356847abb44afd0feec39804',
    url: '/blog'
  },
  siteNotice: {
    title: 'Site Notice',
    pageId: '33bd457e4b11404e80298b5b47e99483',
    url: '/site-notice'
  }
}

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: 'd7e1dc5a47b749df84a580ba2591cd1c',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Jano Detzel',
  domain: 'janodetzel.com',
  author: 'Jano Detzel',

  // open graph metadata (optional)
  description: 'Full stack developer based in Germany',

  // social usernames (optional)
  twitter: 'janodetzel1',
  github: 'janodetzel',
  // linkedin: 'fisch2',
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: {
    '/vscode-neovim': 'd998daa10b314ecd973b44b919fb6dd3'
  },

  // whether to use the default notion navigation style or a custom one with links to
  // important pages
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [pages.home, pages.blog]
})
