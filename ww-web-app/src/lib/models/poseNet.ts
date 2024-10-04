import * as posenet from '@tensorflow-models/posenet';

export async function loadPoseNet() {
	const net = await posenet.load();
	return net;
}
