export default function SectionLabel({ label }: { label: string }) {
    return (
        <h2 className="text-sm font-semibold text-gray-600 mb-2 ml-1">
            {label}
        </h2>
    );
}
