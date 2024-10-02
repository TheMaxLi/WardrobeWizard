<script lang="ts">
	let userPhoto: File | null = null;
	let clothingPhoto: File | null = null;
	function handleUpload(event: Event, type: 'user' | 'clothing') {
		const input = event.target as HTMLInputElement;
		const file = input.files ? input.files[0] : null;
		if (type === 'user') userPhoto = file;
		else if (type === 'clothing') clothingPhoto = file;
	}

	function tryOn(): void {
		if (userPhoto && clothingPhoto) {
			// Add logic to process photos with AI
			console.log('User Photo:', userPhoto);
			console.log('Clothing Photo:', clothingPhoto);
		}
	}
</script>

<form on:submit|preventDefault={tryOn}>
	<label for="userPhoto">Upload your photo:</label>
	<input type="file" id="userPhoto" accept="image/*" on:change={(e) => handleUpload(e, 'user')} />

	<label for="clothingPhoto">Upload clothing photo:</label>
	<input
		type="file"
		id="clothingPhoto"
		accept="image/*"
		on:change={(e) => handleUpload(e, 'clothing')}
	/>

	<button type="submit">Try On</button>
</form>
