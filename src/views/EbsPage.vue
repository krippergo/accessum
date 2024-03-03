<script>
import axios from 'axios';

export default {
	methods: {
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
	<main class="personal">
		<h2 class="title">Страница в разработке</h2>
	</main>
</template>

<style>

</style>