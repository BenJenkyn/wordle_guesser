<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function confirm() {
		dispatch('confirm');
	}
</script>

<div class="modal">
	<div class="modal-content">
		<p>Are you sure you want to clear?</p>
		<button class="confirm-button" on:click={confirm}>Yes</button>
		<button class="confirm-button" on:click={() => dispatch('cancel')}>No</button>
	</div>
</div>

<style>
	.modal {
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgba(0, 0, 0, 0.4);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-content {
		background-color: rgba(0, 0, 0, 1);
		margin: auto;
		padding: 20px;
		border: 1px solid rgba(136, 136, 136, 1);
		width: 80%;
	}

	.modal-content button {
		margin-top: 15px;
	}

  .confirm-button {
    background-color: var(--dark-grey);
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    transition-duration: 0.4s;
  }

  .confirm-button:hover {
    background-color: #888;
  }
</style>
