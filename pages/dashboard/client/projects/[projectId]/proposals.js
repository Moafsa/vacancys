import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ProjectProposals() {
  const router = useRouter();
  const { projectId } = router.query;
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) return;
    async function fetchProposals() {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${projectId}/proposals`);
        if (!res.ok) throw new Error('Failed to fetch proposals');
        const data = await res.json();
        setProposals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProposals();
  }, [projectId]);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2>Proposals for Project</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {proposals.map(proposal => (
          <li key={proposal._id} style={{ marginBottom: 16 }}>
            <strong>Freelancer:</strong> {proposal.freelancerId} <br />
            <strong>Bid:</strong> ${proposal.bidAmount} <br />
            <strong>Status:</strong> {proposal.status} <br />
            <strong>Message:</strong> {proposal.coverLetter}
          </li>
        ))}
      </ul>
    </div>
  );
} 