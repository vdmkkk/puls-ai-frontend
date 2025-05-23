import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ProfilePage.vue') },
      {
        path: 'content-plan',
        name: 'content-plan',
        component: () => import('pages/ContentPlanPage.vue'),
      },
      { path: 'texts', name: 'texts', component: () => import('pages/TextsPage.vue') },
      {
        path: 'texts/posts/:id',
        name: 'texts/posts',
        component: () => import('pages/PostPage.vue'),
      },
      {
        path: 'content-plan/posts/:id',
        name: 'content-plan/posts',
        component: () => import('pages/PostPage.vue'),
      },
      {
        path: 'content-plan/:id',
        name: 'content-plan-posts',
        component: () => import('pages/ContentPlanPostsPage.vue'),
      },
      { path: 'images', name: 'images', component: () => import('pages/ImagesPage.vue') },
      { path: 'archive', name: 'archive', component: () => import('pages/ArchivePage.vue') },
      { path: 'posting', name: 'posting', component: () => import('pages/AutoPostPage.vue') },
      {
        path: 'posting/posts/:id',
        name: 'posting/posts',
        component: () => import('pages/PostPage.vue'),
      },

      { path: 'profile', name: 'profile', component: () => import('pages/MainPage.vue') },
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '/login', name: 'login', component: () => import('pages/LoginPage.vue') },
      { path: '/register', name: 'register', component: () => import('pages/RegisterPage.vue') },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('pages/ForgotPasswordPage.vue'),
      },
      {
        path: '/change_password/:access_token',
        name: 'change_password',
        component: () => import('pages/ChangePasswordPage.vue'),
      },
    ],
  },
  {
    path: '/subscription',
    component: () => import('layouts/SubLayout.vue'),
    children: [
      { path: '/subscription', name: 'subscription', component: () => import('pages/SubPage.vue') },
      { path: '/cart', name: 'cart', component: () => import('pages/CartPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
