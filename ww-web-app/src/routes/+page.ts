// import type { GraphModel } from '@tensorflow/tfjs';
// import type { PageLoad } from './$types';

// export const load = async () => {
//     const modelUrl = 'https://tfhub.dev/tensorflow/deeplabv3/1';

//     try {
//         const response = await fetch(modelUrl);
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const model = await response.json() as GraphModel;
//         return {
//             status: 200,
//             body: model
//         };
//     } catch (error : any) {
//         return {
//             status: 500,
//             body: { error: 'Failed to load model: ' + error.message }
//         };
//     }
// };