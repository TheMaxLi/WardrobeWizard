<script lang="ts">
	import { loadPoseNet } from '$lib/models/poseNet';
	import type { PosenetInput } from '@tensorflow-models/posenet/dist/types';
	let userImage: PosenetInput;
	let pose;

	async function estimatePose() {
		const net = await loadPoseNet();
		pose = await net.estimateSinglePose(userImage, { flipHorizontal: false });
	}
</script>

<input type="file" on:change={(e) => (userImage = e.target.files[0])} />
<button on:click={estimatePose}>Estimate Pose</button>
