import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

// Generic editor for a list of objects — the piece that lets admin add or
// remove as many rows as he wants (hero buttons, about badges, footer
// socials/links, contact info rows). `fields` describes each row's inputs:
//   { key, label, type: 'text' | 'textarea' | 'select' | 'lines', options?, fullWidth? }
// 'lines' = a textarea where each line becomes one string in an array
// (used for contact info like multiple timing lines).
const DynamicListEditor = ({ label, items, onChange, fields, emptyItem, addLabel = "Add" }) => {

    const updateItem = (index, key, value) => {
        const next = [...items];
        next[index] = { ...next[index], [key]: value };
        onChange(next);
    };

    const removeItem = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const addItem = () => {
        onChange([...items, { ...emptyItem }]);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <label className="block text-sm text-gray-400">{label}</label>

                <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300"
                >
                    <Plus size={14} /> {addLabel}
                </button>
            </div>

            <div className="space-y-3">

                {items.length === 0 && (
                    <p className="text-xs text-gray-600 italic">
                        Nothing here yet — click "{addLabel}" to add one.
                    </p>
                )}

                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-800/60 border border-gray-800 rounded-xl p-4 relative"
                    >
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            title="Remove"
                        >
                            <Trash2 size={14} />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                            {fields.map((field) => (
                                <div key={field.key} className={field.fullWidth ? "sm:col-span-2" : ""}>
                                    <label className="block text-xs text-gray-500 mb-1">
                                        {field.label}
                                    </label>

                                    {field.type === 'select' ? (
                                        <select
                                            value={item[field.key] ?? ''}
                                            onChange={(e) => updateItem(index, field.key, e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg outline-none text-white text-sm"
                                        >
                                            {field.options.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : field.type === 'textarea' ? (
                                        <textarea
                                            value={item[field.key] ?? ''}
                                            onChange={(e) => updateItem(index, field.key, e.target.value)}
                                            rows={2}
                                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg outline-none text-white text-sm resize-none"
                                        />
                                    ) : field.type === 'lines' ? (
                                        <textarea
                                            value={(item[field.key] ?? []).join('\n')}
                                            onChange={(e) =>
                                                updateItem(index, field.key, e.target.value.split('\n'))
                                            }
                                            rows={3}
                                            placeholder="One line per row"
                                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg outline-none text-white text-sm resize-none"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={item[field.key] ?? ''}
                                            onChange={(e) => updateItem(index, field.key, e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg outline-none text-white text-sm"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default DynamicListEditor;





