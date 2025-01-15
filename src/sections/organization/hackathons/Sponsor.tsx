import React, { useState } from 'react';
import { Plus, Pencil, Trash, Link } from 'lucide-react';

interface Sponsor {
  name: string;
  title: string;
  description: string;
  link: string;
}

interface SponsorManagerProps {
  sponsors: Sponsor[];
  addSponsor: (sponsor: Sponsor) => void;
  editSponsor: (index: number, sponsor: Sponsor) => void;
  deleteSponsor: (index: number) => void;
}

const Sponsors: React.FC<SponsorManagerProps> = ({ sponsors, addSponsor, editSponsor, deleteSponsor }) => {
  const [sponsorName, setSponsorName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [linkError, setLinkError] = useState('');

  const validateLink = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  const resetFields = () => {
    setSponsorName('');
    setTitle('');
    setDescription('');
    setLink('');
    setLinkError('');
    setIsEditing(null);
  };

  const handleClose = () => {
    setShowModal(false);
    resetFields();
  };

  const handleAddOrEditSponsor = () => {
    if (!sponsorName.trim() || !title.trim() || !description.trim() || !link.trim()) return;

    if (!validateLink(link)) {
      setLinkError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    const newSponsor: Sponsor = {
      name: sponsorName,
      title,
      description,
      link,
    };

    if (isEditing !== null) {
      editSponsor(isEditing, newSponsor);
    } else {
      addSponsor(newSponsor);
    }

    handleClose();
  };

  const handleEditSponsor = (index: number) => {
    const sponsor = sponsors[index];
    setSponsorName(sponsor.name);
    setTitle(sponsor.title);
    setDescription(sponsor.description);
    setLink(sponsor.link);
    setIsEditing(index);
    setShowModal(true);
  };

  return (
    <div className="w-full flex flex-col gap-6 relative">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 w-fit"
        onClick={() => setShowModal(true)}
      >
        <Plus size={20} />
        Add Sponsor
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{isEditing !== null ? 'Edit Sponsor' : 'Add Sponsor'}</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                &#x2715;
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Sponsor Name</label>
                <input
                  value={sponsorName}
                  onChange={e => setSponsorName(e.target.value)}
                  maxLength={50}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter sponsor name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={50}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter sponsor title"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  maxLength={250}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter sponsor description"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Website Link</label>
                <input
                  value={link}
                  onChange={e => {
                    setLink(e.target.value);
                    setLinkError('');
                  }}
                  maxLength={100}
                  className={`w-full px-4 py-2 rounded-lg bg-gray-800 border ${
                    linkError ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="https://example.com"
                />
                {linkError && <span className="text-sm text-red-500">{linkError}</span>}
              </div>

              <button
                className="w-full mt-2 bg-blue-500 text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddOrEditSponsor}
                disabled={!sponsorName.trim() || !title.trim() || !description.trim() || !link.trim()}
              >
                {isEditing !== null ? 'Save Changes' : 'Add Sponsor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {sponsors.length > 0 && (
        <div className="w-full flex flex-wrap gap-4">
          {sponsors.map((sponsor, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex flex-col w-full">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg">{sponsor.name}</h3>
                  <p className="text-gray-300 font-medium">{sponsor.title}</p>
                  <p className="text-gray-400">{sponsor.description}</p>
                  <a
                    href={sponsor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                  >
                    <Link size={16} />
                    {new URL(sponsor.link).hostname}
                  </a>
                </div>
                <div className="flex gap-3 ml-4">
                  <button onClick={() => handleEditSponsor(idx)}>
                    <Pencil className="text-blue-400 hover:text-blue-300 transition-colors" size={20} />
                  </button>
                  <button onClick={() => deleteSponsor(idx)}>
                    <Trash className="text-red-400 hover:text-red-300 transition-colors" size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sponsors;
