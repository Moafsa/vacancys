import React, { useState } from 'react';
import FreelancerLayout from '../../../components/dashboard/FreelancerLayout';
import { AcademicCapIcon } from '@heroicons/react/outline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const FreelancerSkills = () => {
  // MOCK: Substitua por integração real futuramente
  const [skills, setSkills] = useState(['JavaScript', 'React', 'Node.js', 'UI/UX Design']);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <FreelancerLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <AcademicCapIcon className="h-7 w-7 mr-2 text-green-500" />
          <h2 className="text-2xl font-bold text-green-800">My Skills</h2>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Add Skill</label>
            <div className="flex">
              <input
                type="text"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mr-2"
                placeholder="Type a skill..."
              />
              <button
                onClick={addSkill}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
                type="button"
              >
                Add
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Your Skills</label>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-green-600 hover:text-green-900 font-bold"
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))}
              {skills.length === 0 && <span className="text-gray-500">No skills added yet.</span>}
            </div>
          </div>
        </div>
      </div>
    </FreelancerLayout>
  );
};

export default FreelancerSkills;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 