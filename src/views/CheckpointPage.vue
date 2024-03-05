<script>
import axios from 'axios';

export default {
	data() {
		return {
			checkpoint: {}
		};
	},
	methods: {
		async authentication() {
			const response = await axios.get('/server/account/authentication');

			if(response.status != 200) {
				this.$router.push({
					name: 'business'
				});
			}
		},
		async loadCheckpoint() {
			if(this.$route.params.id) {
				const response = await axios.get('/checkpoint/get', {
					params: {
						id: this.$route.params.id
					}
				});
				
				if(response.data.code == 0) {
					this.checkpoint = response.data.msg;
				} else {
					this.$router.back();
				}
			}
		},
	},
	mounted() {
		this.authentication();
		this.loadCheckpoint();
	}
}
</script>
<template>
	<main class="checkpoint">
		<div class="img-box">
			<img :src="checkpoint.qr_url" class="qr" alt="QR-код">
		</div>
		<div class="description-box">
			<h1 class="title">Просканируйте QR-код</h1>
			<button class="button">Подтвердить открытие</button>
		</div>
	</main>
</template>

<style>

</style>