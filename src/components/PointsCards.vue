<script>
export default {
    data() {
        return {};
    },
    methods: {
		goVisits(id) {
			this.$router.push({
				path: '/visits/' + id
			});
		},
		goVisitors() {
			this.$router.push({
				name: 'visitors'
			});
		},
		goCheckpoints() {
			this.$router.push({
				name: 'checkpoints'
			});
		}
	}
}
</script>
<template>
	<h3 class="subtitle">Список точек</h3>
	<div class="cards">
		<div class="card">
			<h4 class="title">г. Самара ул. Губанова д. 16 кв. 25</h4>
			<p class="text">Владелец</p>
			<div class="buttons-box">
				<button class="button" @click="goVisitors">Посетители</button>
				<button class="button" @click="goCheckpoints">КПП</button>
			</div>
		</div>
	</div>
</template>

<style>

</style>