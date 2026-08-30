export default function AboutPage() {
    return (
        <div className="mx-auto max-w-2xl px-4 py-16">
            <h1 className="mb-6 text-3xl font-semibold">About</h1>
            <div className="flex flex-col gap-4 text-muted-foreground">
                <p>
                    We design and 3D print functional, everyday objects on a Creality K1C. Every
                    item is made to order.
                </p>
                <p>
                    Have a model of your own? Upload an STL or 3MF file and we&apos;ll print it for
                    you, in the material and finish you choose.
                </p>
            </div>
        </div>
    );
}
