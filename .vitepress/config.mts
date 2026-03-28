import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "LikhaERP Docs",
  description: "LikhaERP Docs",
  outDir: './docs',
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      src: '/logo.png',
      alt: 'Likha ERP',
      height: 32
    },
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Quickstarts',
        items: [
          { text: 'API Quickstart', link: '/api-quickstart' },
          { text: 'Auth Quickstart', link: '/auth-quickstart' },
          { text: 'Automation Quickstart', link: '/automation-quickstart' },
          { text: 'Realtime Quickstart', link: '/realtime-quickstart' }
        ]
      },
      {
        text: 'Core Concepts',
        items: [
          { text: 'Data Model Setup', link: '/data-model-setup' },
          { text: 'Computed Fields', link: '/computed-fields' },
          { text: 'Filters', link: '/filters' },
          { text: 'Query Parameters', link: '/query-parameters' }
        ]
      },
      {
        text: 'Authentication',
        items: [
          { text: 'Overview', link: '/auth/' },
          { text: 'Login', link: '/auth/login' },
          { text: 'Logout', link: '/auth/logout' },
          { text: 'Password Reset', link: '/auth/password-reset' },
          { text: 'Refresh Token', link: '/auth/refresh' },
          { text: 'OAuth', link: '/auth/oauth' },
          { text: 'OAuth Provider', link: '/auth/oauth-provider' },
          { text: 'Password Request', link: '/auth/password-request' }
        ]
      },
      {
        text: 'Automation',
        items: [
          { text: 'Overview', link: '/automation/' },
          { text: 'Triggers', link: '/automation/triggers' },
          { text: 'Flows', link: '/automation/flows' },
          { text: 'Operations', link: '/automation/operations' },
          { text: 'Data Chain', link: '/automation/data-chain' }
        ]
      },
      {
        text: 'Files',
        items: [
          { text: 'Overview', link: '/files/' },
          { text: 'Upload', link: '/files/upload' },
          { text: 'Access', link: '/files/access' },
          { text: 'Transform', link: '/files/transform' }
        ]
      },
      {
        text: 'Items',
        items: [
          { text: 'List', link: '/items/list' },
          { text: 'Get', link: '/items/get' },
          { text: 'Create', link: '/items/create' },
          { text: 'Update', link: '/items/update' },
          { text: 'Delete', link: '/items/delete' },
          { text: 'Singleton', link: '/items/singleton' },
          { text: 'Create Multiple', link: '/items/create-multiple' },
          { text: 'Update Multiple', link: '/items/update-multiple' },
          { text: 'Delete Multiple', link: '/items/delete-multiple' }
        ]
      },
      {
        text: 'Realtime',
        items: [
          { text: 'Overview', link: '/realtime/' },
          { text: 'Subscriptions', link: '/realtime/subscriptions' },
          { text: 'Actions', link: '/realtime/actions' },
          { text: 'Authentication', link: '/realtime/authentication' },
          { text: 'Custom WebSocket Handlers', link: '/realtime/custom-websocket-handlers' }
        ]
      }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Home', link: '/' },
          { text: 'API Quickstart', link: '/api-quickstart' },
          { text: 'Auth Quickstart', link: '/auth-quickstart' },
          { text: 'Automation Quickstart', link: '/automation-quickstart' },
          { text: 'Realtime Quickstart', link: '/realtime-quickstart' }
        ]
      },
      {
        text: 'Core Concepts',
        items: [
          { text: 'Data Model Setup', link: '/data-model-setup' },
          { text: 'Computed Fields', link: '/computed-fields' },
          { text: 'Filters', link: '/filters' },
          { text: 'Query Parameters', link: '/query-parameters' }
        ]
      },
      {
        text: 'Authentication',
        items: [
          { text: 'Overview', link: '/auth/' },
          { text: 'Login', link: '/auth/login' },
          { text: 'Logout', link: '/auth/logout' },
          { text: 'Password Reset', link: '/auth/password-reset' },
          { text: 'Refresh Token', link: '/auth/refresh' },
          { text: 'OAuth', link: '/auth/oauth' },
          { text: 'OAuth Provider', link: '/auth/oauth-provider' },
          { text: 'Password Request', link: '/auth/password-request' }
        ]
      },
      {
        text: 'Automation',
        items: [
          { text: 'Overview', link: '/automation/' },
          { text: 'Triggers', link: '/automation/triggers' },
          { text: 'Flows', link: '/automation/flows' },
          { text: 'Operations', link: '/automation/operations' },
          { text: 'Data Chain', link: '/automation/data-chain' }
        ]
      },
      {
        text: 'Files',
        items: [
          { text: 'Overview', link: '/files/' },
          { text: 'Upload', link: '/files/upload' },
          { text: 'Access', link: '/files/access' },
          { text: 'Transform', link: '/files/transform' }
        ]
      },
      {
        text: 'Items',
        items: [
          { text: 'List', link: '/items/list' },
          { text: 'Get', link: '/items/get' },
          { text: 'Create', link: '/items/create' },
          { text: 'Update', link: '/items/update' },
          { text: 'Delete', link: '/items/delete' },
          { text: 'Singleton', link: '/items/singleton' },
          { text: 'Create Multiple', link: '/items/create-multiple' },
          { text: 'Update Multiple', link: '/items/update-multiple' },
          { text: 'Delete Multiple', link: '/items/delete-multiple' }
        ]
      },
      {
        text: 'Realtime',
        items: [
          { text: 'Overview', link: '/realtime/' },
          { text: 'Subscriptions', link: '/realtime/subscriptions' },
          { text: 'Actions', link: '/realtime/actions' },
          { text: 'Authentication', link: '/realtime/authentication' },
          { text: 'Custom WebSocket Handlers', link: '/realtime/custom-websocket-handlers' }
        ]
      }
    ],

    socialLinks: [
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" style="fill:none" stroke="var(--vp-c-brand-1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'
        },
        link: 'https://likhaerp.com'
      }
    ]
  }
})
