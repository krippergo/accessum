<script>
import axios from 'axios';

export default {
	data() {
		return {};
	},
	methods: {
		goBusiness() {
			this.$router.push({
				name: 'business'
			});
		},
		goHome() {
			this.$router.push({
				name: 'home'
			});
		},
		goRegistration() {
			this.$router.push({
				name: 'registration'
			});
		},
		async authentication() {
			const response = await axios.get('/server/account/authentication');

			if(response.status == 200) {
				this.$router.push({
					name: 'visitors'
				});
			}
		}
	},
	mounted() {
		this.authentication();
	}
}
</script>
<template>
	<main class="main">
		<div class="switch-box">
			<button class="switch-buttons" :class="{ 'active': $route.name == 'business' }"@click="goBusiness">Для бизнеса</button>
			<button class="switch-buttons" :class="{ 'active': $route.name == 'home' }" @click="goHome">Для дома</button>
		</div>
		<h2 class="title" v-if="$route.name == 'business'">Удалённый контроль доступа<br>и анализ посещаемости</h2>
		<h2 class="title" v-else-if="$route.name == 'home'">Ваш дом -<br>ваш контроль</h2>
		<button class="button" @click="goRegistration">Быстрый старт</button>
	</main>
</template>

<style>

</style>