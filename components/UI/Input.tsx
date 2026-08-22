type InputProps = {
    label?: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
};

export default function Input({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    required = false,
}: InputProps) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm font-medium">
                    {label}
                </label>
            )}

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="rounded-lg border px-3 py-2 outline-none focus:ring-2"
            />
        </div>
    );
}