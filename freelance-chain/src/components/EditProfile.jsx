import { useState } from 'react';

export default function ProfileEdit({ profile, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="bg-white shadow rounded p-4">
      <label className="block mb-2">
        Name:
        <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-2 py-1" />
      </label>
      <label className="block mb-2">
        Bio:
        <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border rounded px-2 py-1" />
      </label>
      <div className="flex gap-4 mt-4">
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
      </div>
    </form>
  );
}
