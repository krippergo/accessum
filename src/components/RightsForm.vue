<script>
import axios from 'axios';

export default {
	data() {
		return {
			login: '',
			errmsg: ''
		}
	},
	methods: {
		async rights(evt) {
			evt.preventDefault();

			if(this.login.length > 0) {
				const response = await axios.post('/rights/add', {
					login: this.login
				});

				if(response.data.code == 0) {
					this.login = '';

					this.$router.push({
						name: 'visitors'
					});
				} else {
					this.errmsg = response.data.msg;
				}
			} else {
				this.errmsg = 'Заполните все поля!'
			}
		},
		async isAuthorized() {
			const response = await axios.get('/account/authorized');

			if(response.data.code != 0) {
				this.$router.push({
					name: 'business'
				});
			}
		}
	},
	beforeMount() {
		this.isAuthorized();
	}
}
</script>

<template>
	<form @submit="rights">
		<router-link to="/visitors">
			<p class="text">&lt; назад</p>
		</router-link>
		<h2 class="form-title">Выдача прав</h2>
		<div class="block">
			<p>Логин человека:</p>
			<input type="text" class="input" v-model="login">
		</div>
		<p class="error">{{ errmsg }}</p>
		<button class="button">Выдать права</button>
	</form>
</template>

<style>
</style>