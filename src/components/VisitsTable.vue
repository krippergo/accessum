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
		}
	}
}
</script>
<template>
	<h3 class="subtitle">Таблица посещений Иванов Иван Иванович</h3>
	<div class="table">
		<header class="header">
			<div class="cell two">Адрес/название точки</div>
			<div class="cell one">Дата</div>
			<div class="cell one">Время входа</div>
			<div class="cell one">Время выхода</div>
		</header>
		<div class="row">
			<div class="cell two">КВАНТОРИУМ63</div>
			<div class="cell one">03.03.2024</div>
			<div class="cell one">8:00</div>
			<div class="cell one">8:41</div>
		</div>
		<div class="row">
			<div class="cell two">КВАНТОРИУМ63</div>
			<div class="cell one">03.03.2024</div>
			<div class="cell one">10:15</div>
			<div class="cell one">14:39</div>
		</div>
		<div class="row">
			<div class="cell two">КВАНТОРИУМ63</div>
			<div class="cell one">03.03.2024</div>
			<div class="cell one">16:55</div>
			<div class="cell one">17:08</div>
		</div>
	</div>
</template>

<style>

</style>