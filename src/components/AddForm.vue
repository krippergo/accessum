<script>
import axios from 'axios';

export default {
	data() {
		return {
			name: '',
			errmsg: ''
		}
	},
	methods: {
		async add(evt) {
			evt.preventDefault();

			if(this.name.length > 0) {
				const response = await axios.post('/server/points/create', {
					name: this.name
				});

				if(response.data.ok) {
					this.name = '';

					this.$router.push({
						name: 'points'
					});
				} else {
					this.errmsg = response.data.msg;
				}
			} else {
				this.errmsg = 'Заполните все поля!'
			}
		},
		async authentication() {
			const response = await axios.get('/server/account/authentication');

			if(!response.data.ok) {
				this.$router.push({
					name: 'business'
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
	<form @submit="add">
		<router-link to="/points">
			<p class="text">&lt; назад</p>
		</router-link>
		<h2 class="form-title">Добавление точки</h2>
		<div class="block">
			<p>Адрес/название точки:</p>
			<input type="text" class="input" v-model="name">
		</div>
		<p class="error">{{ errmsg }}</p>
		<button class="button">Добавить точку</button>
	</form>
</template>

<style>
</style>