<script>
import axios from 'axios';

export default {
	methods: {
		async authentication() {
			const response = await axios.get('/server/account/authentication');

			if(response.status != 200) {
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
	<main class="personal">
		<h2 class="title">Страница в разработке</h2>
	</main>
</template>

<style>

</style>