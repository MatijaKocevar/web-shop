export default function FaqPage() {
    const faqs = [
        {
            q: "What file formats can I upload?",
            a: "STL and 3MF. 3MF files can carry colors and materials.",
        },
        {
            q: "How accurate is the instant quote?",
            a: "The instant quote is an estimate. The final price is confirmed by an exact slice of your model before printing.",
        },
        {
            q: "What materials do you print in?",
            a: "Currently PLA and PETG, with more coming.",
        },
        {
            q: "How long does printing take?",
            a: "Depends on size and settings — you'll see an estimate for each order.",
        },
    ];

    return (
        <div className="mx-auto max-w-2xl px-4 py-16">
            <h1 className="mb-6 text-3xl font-semibold">FAQ</h1>
            <div className="flex flex-col gap-6">
                {faqs.map((faq) => (
                    <div key={faq.q}>
                        <h2 className="mb-1 font-medium">{faq.q}</h2>
                        <p className="text-muted-foreground">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
