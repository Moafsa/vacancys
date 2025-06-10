import { useState } from 'react';
import { useRouter } from 'next/router';
import ClientLayout from '../../../components/dashboard/ClientLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
    requiredSkills: '',
    visibility: 'public',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          requiredSkills: form.requiredSkills.split(',').map(s => s.trim()),
          budget: Number(form.budget),
        }),
      });
      if (!res.ok) throw new Error('Failed to create project');
      router.push('/dashboard/client/projects');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Create Project</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" className="input w-full border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Title" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" className="input w-full border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Description" value={form.description} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input name="category" className="input w-full border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Category" value={form.category} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input name="budget" type="number" className="input w-full border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Budget" value={form.budget} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input name="deadline" type="date" className="input w-full border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Deadline" value={form.deadline} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
              <input name="requiredSkills" className="input w-full border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Required Skills (comma separated)" value={form.requiredSkills} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
            <select name="visibility" className="input w-full border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500" value={form.visibility} onChange={handleChange}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all">
            {loading ? 'Creating...' : 'Create Project'}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </div>
    </ClientLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 