import * as tf from '@tensorflow/tfjs';

export async function loadUNetModel() {
	const model = await tf.loadGraphModel('/tensorflow-models/unet/model.json');
	return model;
}
