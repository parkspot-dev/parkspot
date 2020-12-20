<template>
	<form action="">
        <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
                <p class="modal-card-title">Failed to fetch parking sites</p>
                <button
                    type="button"
                    class="delete"
                    @click="$emit('close')"/>
            </header>
            <section class="modal-card-body">
			<p class="is-text-3">Presently we are active only in a few cities.No worries, we are expanding rapidly</p>
			</section>
        </div>
    </form>
</template>
<script>
export default{
	name: "EmptySitesModal",
}
</script>
