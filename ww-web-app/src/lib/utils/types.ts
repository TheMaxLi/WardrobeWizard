export interface Keypoint {
	score: number;
	part: string;
	position: {
		x: number;
		y: number;
	};
}

export interface Pose {
	score: number;
	keypoints: Keypoint[];
}
