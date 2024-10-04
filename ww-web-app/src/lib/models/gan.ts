import * as tf from '@tensorflow/tfjs';

export async function loadGANModel() {
	const model = await tf.loadGraphModel('/tensorflow-models/gan/model.json');
	return model;
}
