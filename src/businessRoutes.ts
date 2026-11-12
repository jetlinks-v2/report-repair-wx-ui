import type {RouteRecordRaw} from 'vue-router'
export const businessRoutes:RouteRecordRaw[]=[
{path:'',component:()=>import('./views/HomePage.vue')},
{path:'orders',component:()=>import('./views/OrderListPage.vue')},
{path:'orders/:id',component:()=>import('./views/OrderDetailPage.vue')},
{path:'orders/:id/action/:action',component:()=>import('./views/ActionPage.vue')},
{path:'create',component:()=>import('./views/CreatePage.vue')},
{path:'profile',component:()=>import('./views/ProfilePage.vue')},]
