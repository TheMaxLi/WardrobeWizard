import * as tf from '@tensorflow/tfjs';

export function preprocessImage(
	image:
		| tf.PixelData
		| ImageData
		| HTMLImageElement
		| HTMLCanvasElement
		| HTMLVideoElement
		| ImageBitmap
) {
	const tensor = tf.browser.fromPixels(image).toFloat();
	const resized = tf.image.resizeBilinear(tensor, [128, 128]); // Resize to match model's input
	return resized.div(255).expandDims(0); // Normalize and add batch dimension
}
