<script>
export default {
	props: {
		text: "",
		values: {}
	}
}
</script>

<template>
	<div class="form-block">
		<p>{{ text }}</p>
		<select class="input select">
			<option v-for="item in values" :value="item.value">{{ item.text }}</option>
		</select>
	</div>
</template>

<style>
</style>