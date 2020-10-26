<template lang="pug">
	.wrapper
		.hero.is-fullheight.is-warning
			.hero-head
				.hero-body
					.container
						.columns
							.column.is-full.is-vcentered.is-centered
								p.title
									| Thanks for reaching out to us.
								.thanks.inline
									a(href="mailto:connect@parkspot.in")
										p.subtitle
											| Please email your further concerns at connect@parkspot.in
</template>
<script>
	export default{
		name: 'PSThanks'
	}
</script>
<style scoped>
.container{
	margin: 0 auto;

	width: 80%;
}	
</style>
