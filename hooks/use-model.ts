import { useEffect, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { ThreeMFLoader } from "three/addons/loaders/3MFLoader.js";

export type ModelFormat = "stl" | "3mf";

export type ModelStats = {
    width: number;
    height: number;
    depth: number;
    volume: number;
    triangleCount: number;
};

type LoadedModel = {
    object: THREE.Object3D;
    stats: ModelStats;
};

type LoadState = {
    src: string;
    format: ModelFormat;
    model: LoadedModel | null;
    error: string | null;
};

function computeVolume(geo: THREE.BufferGeometry, matrix: THREE.Matrix4): number {
    const pos = geo.attributes.position;
    const idx = geo.index;
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const cross = new THREE.Vector3();
    const triCount = (idx ? idx.count : pos.count) / 3;
    let volume = 0;

    for (let i = 0; i < triCount; i++) {
        const i0 = idx ? idx.getX(i * 3) : i * 3;
        const i1 = idx ? idx.getX(i * 3 + 1) : i * 3 + 1;
        const i2 = idx ? idx.getX(i * 3 + 2) : i * 3 + 2;
        a.fromBufferAttribute(pos, i0);
        b.fromBufferAttribute(pos, i1);
        c.fromBufferAttribute(pos, i2);
        a.applyMatrix4(matrix);
        b.applyMatrix4(matrix);
        c.applyMatrix4(matrix);
        cross.copy(b).sub(a).cross(c.clone().sub(a));
        volume += a.dot(cross) / 6;
    }

    return Math.abs(volume);
}

function analyze(object: THREE.Object3D): ModelStats {
    object.updateMatrixWorld(true);
    const box = new THREE.Box3();
    const size = new THREE.Vector3();
    let volume = 0;
    let triangles = 0;

    object.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh || !mesh.geometry) return;

        mesh.geometry.computeBoundingBox();
        if (mesh.geometry.boundingBox) {
            box.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld));
        }

        const pos = mesh.geometry.attributes.position;
        const idx = mesh.geometry.index;
        triangles += (idx ? idx.count : pos.count) / 3;
        volume += computeVolume(mesh.geometry, mesh.matrixWorld);
    });

    box.getSize(size);
    return {
        width: size.x,
        height: size.y,
        depth: size.z,
        volume,
        triangleCount: triangles,
    };
}

function normalize(object: THREE.Object3D): THREE.Group {
    const wrapper = new THREE.Group();
    wrapper.add(object);

    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    object.position.sub(center);

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    wrapper.scale.setScalar(1 / maxDim);

    return wrapper;
}

function loadModel(src: string, format: ModelFormat): Promise<LoadedModel> {
    return new Promise((resolve, reject) => {
        const onLoad = (result: unknown) => {
            try {
                let object: THREE.Object3D;
                if (format === "stl") {
                    const geometry = result as THREE.BufferGeometry;
                    const material = new THREE.MeshStandardMaterial({
                        color: 0x9ca3af,
                        roughness: 0.55,
                        metalness: 0.15,
                    });
                    object = new THREE.Mesh(geometry, material);
                } else {
                    object = result as THREE.Object3D;
                }

                const stats = analyze(object);
                const wrapper = normalize(object);
                resolve({ object: wrapper, stats });
            } catch (err) {
                reject(err);
            }
        };

        const loader = format === "stl" ? new STLLoader() : new ThreeMFLoader();
        loader.load(src, onLoad, undefined, reject);
    });
}

export function useModel(src: string, format: ModelFormat, onStats?: (stats: ModelStats) => void) {
    const [result, setResult] = useState<LoadState | null>(null);

    useEffect(() => {
        let cancelled = false;

        loadModel(src, format)
            .then((model) => {
                if (cancelled) return;
                setResult({ src, format, model, error: null });
                onStats?.(model.stats);
            })
            .catch((err) => {
                if (cancelled) return;
                console.error(err);
                setResult({ src, format, model: null, error: "Could not load model." });
            });

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src, format]);

    const model = result && result.src === src && result.format === format ? result.model : null;
    const error = result && result.src === src && result.format === format ? result.error : null;

    return { model, error };
}
