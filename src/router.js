import { createRouter, createWebHistory } from 'vue-router'

// Компоненты страниц
import MainPage from './views/MainPage.vue';
import FormsPage from './views/FormsPage.vue';
import PersonalPage from './views/PersonalPage.vue';
import EbsPage from './views/EbsPage.vue';

export default createRouter({
	// История переходов сохраняется
	history: createWebHistory(),

	// Роуты и компоненты
	routes: [
		{
			path: '/',
			name: 'business',
			component: MainPage
		},
		{
			path: '/home',
			name: 'home',
			component: MainPage
		},
		{
			path: '/login',
			name: 'login',
			component: FormsPage
		},
		{
			path: '/registration',
			name: 'registration',
			component: FormsPage
		},
		{
			path: '/edit',
			name: 'edit',
			component: FormsPage
		},
		{
			path: '/add',
			name: 'add',
			component: FormsPage
		},
		{
			path: '/rights',
			name: 'rights',
			component: FormsPage
		},
		{
			path: '/visitors',
			name: 'visitors',
			component: PersonalPage
		},
		{
			path: '/points',
			name: 'points',
			component: PersonalPage
		},
		{
			path: '/points/id/checkpoints',
			name: 'checkpoints',
			component: PersonalPage
		},
		{
			path: '/visits/id',
			name: 'visits',
			component: PersonalPage
		},
		{
			path: '/ebs',
			name: 'ebs',
			component: EbsPage
		},
		{
			path: '/:catchAll(.*)',
			redirect: '/'
		},
	]
})