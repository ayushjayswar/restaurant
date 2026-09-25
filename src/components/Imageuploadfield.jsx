import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, Loader2 } from 'lucide-react';

// const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://lcd-dressing-jim-oven.trycloudflare.com";

// Reusable image field for every admin form: URL paste OR upload straight
// from the phone gallery / camera. `accept="image/*"` on a plain file
// input is enough to make mobile browsers open the gallery/camera picker
// — no extra code needed for that part.
//
// IMPORTANT: this posts multipart/form-data to /admin/upload. If your
// `authFetch` in AuthContext always forces `Content-Type: application/json`,
// this upload will fail (the browser needs to set its own multipart
// boundary). Check AuthContext — the fetch wrapper should only add the
// JSON header when the body isn't a FormData instance, e.g.:
//   const headers = { Authorization: `Bearer ${token}` };
//   if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
const ImageUploadField = ({ label, value, onChange, authFetch }) => {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [mode, setMode] = useState('url');

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await authFetch('/admin/upload', {
                method: 'POST',
                body: formData,
            });

            let result = null;
            try {
                result = await response.json();
            } catch {
                // response body wasn't valid JSON (e.g. empty or HTML error page)
            }

            if (!response.ok) {
                // FastAPI validation errors return `detail` as an ARRAY of
                // objects (e.g. [{ loc, msg, type }]), not a plain string.
                // Passing that straight into `new Error(...)` stringifies it
                // to the literal text "[object Object]", which is the bug
                // that was happening here.
                let message = 'Upload failed';
                if (result?.detail) {
                    if (typeof result.detail === 'string') {
                        message = result.detail;
                    } else if (Array.isArray(result.detail)) {
                        message = result.detail
                            .map((d) => d?.msg || JSON.stringify(d))
                            .join(', ');
                    } else {
                        message = JSON.stringify(result.detail);
                    }
                } else if (!result) {
                    message = `Upload failed (status ${response.status})`;
                }
                throw new Error(message);
            }

            const url = result?.url?.startsWith('http')
                ? result.url
                : `${API_URL}${result?.url ?? ''}`;

            onChange(url);
        } catch (err) {
            console.error('Image upload error:', err);
            const readable = err instanceof Error ? err.message : String(err);
            alert(`Image upload nahi ho paaya: ${readable}\nDobara try karo ya URL paste karo.`);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <label className="block text-sm text-gray-400 mb-2">{label}</label>

            <div className="flex gap-2 mb-3">
                <button
                    type="button"
                    onClick={() => setMode('url')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        mode === 'url'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                >
                    <LinkIcon size={13} /> Paste URL
                </button>

                <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        mode === 'upload'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                >
                    <Upload size={13} /> Upload from gallery
                </button>
            </div>

            {mode === 'url' ? (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none focus:border-red-500 text-white placeholder:text-gray-600"
                />
            ) : (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="w-full text-sm text-gray-400 file:mr-3 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white file:text-sm file:font-medium hover:file:bg-red-700 file:cursor-pointer cursor-pointer disabled:opacity-60"
                    />

                    {uploading && (
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                            <Loader2 size={13} className="animate-spin" /> Uploading...
                        </p>
                    )}
                </div>
            )}

            {value && (
                <img
                    src={value}
                    alt="Preview"
                    className="mt-3 w-full h-40 object-cover rounded-xl border border-gray-800"
                />
            )}
        </div>
    );
};

export default ImageUploadField;

