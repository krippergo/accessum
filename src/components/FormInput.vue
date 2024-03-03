<script>
export default {
	props: {
		text: "",
		type: ""
	}
}
</script>

<template>
	<div class="form-block">
		<p>{{ text }}</p>
		<input :type="type" class="input">
	</div>
</template>

<style>
</style>