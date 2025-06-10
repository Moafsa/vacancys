import { useState } from 'react';
import { useRouter } from 'next/router';
import FreelancerLayout from '../../../../../components/dashboard/FreelancerLayout';

export default function Propose() {
  const router = useRouter();
  const { projectId } = router.query;
  const [form, setForm] = useState({
    coverLetter: '',
    bidAmount: '',
    estimatedDelivery: '',
    portfolioLinks: '',
    attachedFiles: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          projectId,
          bidAmount: Number(form.bidAmount),
          estimatedDelivery: new Date(form.estimatedDelivery),
          portfolioLinks: form.portfolioLinks.split(',').map(s => s.trim()),
          attachedFiles: form.attachedFiles ? form.attachedFiles.split(',').map(s => s.trim()) : [],
        }),
      });
      if (!res.ok) throw new Error('Failed to submit proposal');
      router.push('/dashboard/freelancer/proposals');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FreelancerLayout>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Send Proposal</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
            <textarea name="coverLetter" className="input w-full border-gray-300 rounded px-3 py-2 focus:ring-green-500 focus:border-green-500" placeholder="Cover Letter" value={form.coverLetter} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bid Amount</label>
              <input name="bidAmount" type="number" className="input w-full border-gray-300 rounded px-3 py-2 focus:ring-green-500 focus:border-green-500" placeholder="Bid Amount" value={form.bidAmount} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Delivery</label>
              <input name="estimatedDelivery" type="date" className="input w-full border-gray-300 rounded px-3 py-2 focus:ring-green-500 focus:border-green-500" placeholder="Estimated Delivery" value={form.estimatedDelivery} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Links</label>
            <input name="portfolioLinks" className="input w-full border-gray-300 rounded px-3 py-2 focus:ring-green-500 focus:border-green-500" placeholder="Portfolio Links (comma separated)" value={form.portfolioLinks} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attached Files</label>
            <input name="attachedFiles" className="input w-full border-gray-300 rounded px-3 py-2 focus:ring-green-500 focus:border-green-500" placeholder="Attached Files (comma separated URLs)" value={form.attachedFiles} onChange={handleChange} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all">
            {loading ? 'Sending...' : 'Send Proposal'}
          </button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
      </div>
    </FreelancerLayout>
  );
} 