import { useState } from 'react';

export default function ProfileEdit({ profile, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    portfolioLinks: {
      linkedin: profile.portfolioLinks?.linkedin || '',
      github: profile.portfolioLinks?.github || '',
      personalPortfolio: profile.portfolioLinks?.personalPortfolio || ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('portfolioLinks.')) {
      const linkType = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        portfolioLinks: {
          ...prev.portfolioLinks,
          [linkType]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
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

      {/* Portfolio Links Section */}
      <div className="space-y-4 mt-4">
        <h3 className="font-medium">Portfolio Links</h3>
        
        <label className="block">
          LinkedIn:
          <input
            type="url"
            name="portfolioLinks.linkedin"
            value={form.portfolioLinks.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn Profile URL"
            className="w-full border rounded px-2 py-1"
          />
        </label>

        <label className="block">
          GitHub:
          <input
            type="url"
            name="portfolioLinks.github"
            value={form.portfolioLinks.github}
            onChange={handleChange}
            placeholder="GitHub Profile URL"
            className="w-full border rounded px-2 py-1"
          />
        </label>

        <label className="block">
          Personal Portfolio:
          <input
            type="url"
            name="portfolioLinks.personalPortfolio"
            value={form.portfolioLinks.personalPortfolio}
            onChange={handleChange}
            placeholder="Personal Portfolio URL"
            className="w-full border rounded px-2 py-1"
          />
        </label>
      </div>

      <div className="flex gap-4 mt-4">
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
      </div>
    </form>
  );
}
