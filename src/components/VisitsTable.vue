<script>
import axios from 'axios';

export default {
	data() {
		return {};
	},
	methods: {
		goVisitors() {
			this.$router.push({
				name: 'visitors'
			});
		},
		goPoints() {
			this.$router.push({
				name: 'points'
			});
		}
	}
}
</script>
<template>
	<div class="buttons-container">
		<div class="switch-box">
			<button class="switch-buttons" @click="goVisitors">Посетители</button>
			<button class="switch-buttons" @click="goPoints">Точки</button>
		</div>
	</div>
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