import React, { useState } from 'react';
import { Plus, Pencil, Trash } from 'lucide-react';

interface Prize {
  title: string;
  amount: number;
  description: string;
  trackID?: string;
}

interface Track {
  id: string;
  title: string;
}

interface PrizeManagerProps {
  prizes: Prize[];
  addPrize: (prize: Prize) => void;
  editPrize: (index: number, prize: Prize) => void;
  deletePrize: (index: number) => void;
  tracks: Track[];
}

interface FormState {
  title: string;
  amount: string;
  description: string;
  trackID: string;
}

const initialFormState: FormState = {
  title: '',
  amount: '',
  description: '',
  trackID: '',
};

const Prizes: React.FC<PrizeManagerProps> = ({ prizes, addPrize, editPrize, deletePrize, tracks }) => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const resetForm = () => {
    setFormState(initialFormState);
    setIsEditing(null);
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrEditPrize = () => {
    if (!formState.title.trim() || !formState.amount.trim()) return;

    const prize: Prize = {
      title: formState.title,
      amount: Number(formState.amount),
      description: formState.description,
      trackID: formState.trackID || undefined,
    };

    if (isEditing !== null) {
      editPrize(isEditing, prize);
    } else {
      addPrize(prize);
    }

    handleClose();
  };

  const handleEditPrize = (index: number) => {
    const prize = prizes[index];
    setFormState({
      title: prize.title,
      amount: prize.amount.toString(),
      description: prize.description,
      trackID: prize.trackID || '',
    });
    setIsEditing(index);
    setShowModal(true);
  };

  return (
    <div className="w-full flex flex-col gap-6 relative">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 w-fit"
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <Plus size={20} />
        Add Prize
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{isEditing !== null ? 'Edit Prize' : 'Add Prize'}</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                &#x2715;
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Prize Title</label>
                <input
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  maxLength={50}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                  placeholder="Enter prize title"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <textarea
                  name="description"
                  value={formState.description}
                  onChange={handleInputChange}
                  maxLength={250}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white resize-none"
                  placeholder="Enter prize description"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formState.amount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                  placeholder="Enter prize amount"
                />
              </div>

              {tracks.length > 0 && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">Select Track (Optional)</label>
                  <select
                    name="trackID"
                    value={formState.trackID}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
                  >
                    <option value="">Select a track</option>
                    {tracks.map(track => (
                      <option key={track.id} value={track.id} className="bg-gray-800">
                        {track.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                className="w-full mt-2 bg-blue-500 text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddOrEditPrize}
                disabled={!formState.title.trim() || !formState.amount.trim()}
              >
                {isEditing !== null ? 'Save Changes' : 'Add Prize'}
              </button>
            </div>
          </div>
        </div>
      )}

      {prizes.length > 0 ? (
        <div className="w-full flex flex-wrap gap-4">
          {prizes.map((prize, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 flex flex-col w-full">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-lg">{prize.title}</h3>
                  <p className="text-gray-400">{prize.description}</p>
                  <p className="text-green-400 font-medium">{Number(prize.amount).toLocaleString()}</p>
                  {prize.trackID && (
                    <p className="text-sm text-gray-500">
                      Track: {tracks.find(track => track.id === prize.trackID)?.title}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 ml-4">
                  <button onClick={() => handleEditPrize(idx)}>
                    <Pencil className="text-blue-400 hover:text-blue-300 transition-colors" size={20} />
                  </button>
                  <button onClick={() => deletePrize(idx)}>
                    <Trash className="text-red-400 hover:text-red-300 transition-colors" size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          Minimum 1 Prize is required.
        </div>
      )}
    </div>
  );
};

export default Prizes;
