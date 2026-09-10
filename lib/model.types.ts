import type { Object3D } from "three";

export type ModelFormat = "stl" | "3mf";

export type ModelStats = {
    width: number;
    height: number;
    depth: number;
    volume: number;
    triangleCount: number;
};

export type LoadedModel = {
    object: Object3D;
    stats: ModelStats;
};
