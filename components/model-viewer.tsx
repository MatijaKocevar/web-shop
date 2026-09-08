"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { useModel } from "@/hooks/use-model";
import type { ModelFormat, ModelStats } from "@/lib/model";

type ModelViewerProps = {
    src: string;
    format: ModelFormat;
    onStats?: (stats: ModelStats) => void;
    className?: string;
};

export function ModelViewer({ src, format, onStats, className }: ModelViewerProps) {
    const { model, error } = useModel(src, format, onStats);

    return (
        <div className={className}>
            {error ? (
                <div className="flex h-full items-center justify-center text-sm text-destructive">
                    {error}
                </div>
            ) : (
                <Canvas camera={{ position: [2.5, 1.5, 2.5], fov: 40 }}>
                    <ambientLight intensity={0.65} />
                    <directionalLight position={[5, 5, 5]} intensity={1.1} />
                    <directionalLight position={[-4, 2, -3]} intensity={0.4} />
                    <Suspense fallback={null}>
                        {model && <primitive object={model.object} />}
                    </Suspense>
                    <ContactShadows
                        position={[0, -0.95, 0]}
                        opacity={0.4}
                        scale={4}
                        blur={2.2}
                        far={3}
                    />
                    <OrbitControls makeDefault enableDamping />
                </Canvas>
            )}
        </div>
    );
}
