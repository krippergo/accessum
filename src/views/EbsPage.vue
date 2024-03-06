<script>
import axios from 'axios';

export default {
	methods: {
		async authentication() {
			const response = await axios.get('/server/account/authentication');

			if(!response.data.ok) {
				this.$router.push({
					name: 'business'
				});
			}
		},
		async loadAccount() {
			const response = await axios.get('/server/account/data');

			if(response.data.ok) {
				if(response.data.msg.type != 'ebsbusiness' && response.data.msg.type != 'businessplus') {
					this.$router.push({
						name: 'visitors'
					});
				}
			} else {
				this.$router.push({
					name: 'visitors'
				});
			}
		}
	},
	mounted() {
		this.authentication();
		this.loadAccount();
	}
}
</script>
<template>
	<main class="personal">
		<h2 class="title">Страница в разработке</h2>
	</main>
</template>

<style>

</style>