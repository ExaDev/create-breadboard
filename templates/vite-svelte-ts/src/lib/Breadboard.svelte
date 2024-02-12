<script lang="ts">
	import { onMount } from "svelte";
	import board from "./board";

	let boardMessage: string = "";
	let boardInput: string = "Hello, Breadboard!";
	const onInputChanged = async (event: Event) => {
		boardInput = (event.target as HTMLInputElement).value;
		const { output } = await board({ message: boardInput });
		boardMessage = output as string;
	};

	onMount(async () => {
		const { output } = await board({ message: boardInput });
		boardMessage = output as string;
	});
</script>

	<input bind:value={boardInput} on:input={onInputChanged} />
	<p>Board Output: {boardMessage}</p>

