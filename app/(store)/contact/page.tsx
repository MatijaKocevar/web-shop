export default function ContactPage() {
    return (
        <div className="mx-auto max-w-2xl px-4 py-16">
            <h1 className="mb-6 text-3xl font-semibold">Contact</h1>
            <p className="text-muted-foreground">
                Questions about an order or a custom print? Email us at{" "}
                <a href="mailto:hello@printshop.example" className="text-primary hover:underline">
                    hello@printshop.example
                </a>
                .
            </p>
        </div>
    );
}
