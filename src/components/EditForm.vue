<script>
import axios from 'axios';

export default {
	data() {
		return {
			password: '',
			newpassword: '',
			verification: '',
			errmsg: ''
		}
	},
	methods: {
		async edit(evt) {
			evt.preventDefault();

			if(this.password.length > 0 && this.newpassword.length > 0 && this.verification.length > 0) {
				if(this.newpassword.length >= 8) {
					if(this.newpassword == this.verification) {
						const response = await axios.post('/server/account/edit', {
							password: this.password,
							newpassword: this.newpassword
						});

						if(response.data.ok) {
							this.password = '';
							this.newpassword = '';
							this.verification = '';

							this.$router.push({
								name: 'visitors'
							});
						} else {
							this.errmsg = response.data.msg;
						}
					} else {
						this.errmsg = 'Пароли не совпадают'
					}
				} else {
					this.errmsg = 'Новый пароль должен быть не короче 8 символов'
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
	<form @submit="edit">
		<router-link to="/visitors">
			<p class="text">&lt; назад</p>
		</router-link>
		<h2 class="form-title">Изменение пароля</h2>
		<div class="block">
			<p>Пароль:</p>
			<input type="password" class="input" v-model="password">
		</div>
		<div class="block">
			<p>Новый пароль:</p>
			<input type="password" class="input" v-model="newpassword">
		</div>
		<div class="block">
			<p>Подтвердите новый пароль:</p>
			<input type="password" class="input" v-model="verification">
		</div>
		<p class="error">{{ errmsg }}</p>
		<button class="button">Изменить пароль</button>
	</form>
</template>

<style>
</style>