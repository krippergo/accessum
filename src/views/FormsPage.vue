<script>
import RegistrationForm from '@/components/RegistrationForm.vue';
import LoginForm from '@/components/LoginForm.vue';
import EditForm from '@/components/EditForm.vue';
import AddForm from '@/components/AddForm.vue';

export default {
	data() {
		return {};
	},
	components: {
		RegistrationForm,
		LoginForm,
		EditForm,
		AddForm,
	},
	methods: {
		isNotRegistered() {
			if(this.$route.name == 'login' || this.$route.name == 'registration')
				return true;
			else
				return false;
		}
	}
}
</script>
<template>
	<main class="forms">
		<router-link to="/" :class="{'d-none': !isNotRegistered()}">
			<h1 class="title">ACCESSUM</h1>
		</router-link>
		<router-link to="/visitors" :class="{'d-none': isNotRegistered()}">
			<h1 class="title">ACCESSUM</h1>
		</router-link>
		<div class="form-container">
			<RegistrationForm v-if="$route.name == 'registration'" />
			<LoginForm v-if="$route.name == 'login'" />
			<EditForm v-if="$route.name == 'edit'" />
			<AddForm v-if="$route.name == 'add'" />
		</div>
	</main>
</template>

<style>

</style>