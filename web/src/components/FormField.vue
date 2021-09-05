<template lang="slm">
.form-field.column :class.padding-s=!nolabel
	label v-if=!nolabel :title=fielddata.title :for=id :disabled=fielddata.disabled
		| $fielddata.label
	select v-if="fielddata.options||fielddata.optgroups" :id=id v-model=model v-bind=fielddata
		optgroup v-for="optgroup of fielddata.optgroups" :label=optgroup.label
			/ kinda duplicate, not so pretty :-/
			option v-for="option of optgroup.options" :value=option.value
				| {{ option.name || option.value }}
		option v-for="option of fielddata.options" :value=option.value
			| {{ option.name || option.value }}
	slot v-else=""
		input :id=id v-model=model v-bind=fielddata @keypress="$emit('keypress',$event)" onfocus=select()
</template>

<script lang="coffee" src="./FormField.coffee"></script>

<style lang="stylus" scoped>
</style>
