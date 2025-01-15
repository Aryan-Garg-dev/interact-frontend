import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { currentOrgSelector } from '@/slices/orgSlice';
import { ORG_URL } from '@/config/routes';
import Toaster from '@/utils/toaster';
import { SERVER_ERROR } from '@/config/errors';

interface ScoreMetricSchema {
  name: string;
  weightage: number;
}

interface RoundSchema {
  startTime: string;
  endTime: string;
  judgingStartTime: string;
  judgingEndTime: string;
  metrics: ScoreMetricSchema[];
}

interface AddRoundFormProps {
  hackathonId: string;
  onRoundAdded: (round: RoundSchema) => void;
}

export function AddRoundForm({ hackathonId, onRoundAdded }: AddRoundFormProps) {
  const [round, setRound] = useState<RoundSchema>({
    startTime: '',
    endTime: '',
    judgingStartTime: '',
    judgingEndTime: '',
    metrics: [],
  });
  const [newMetric, setNewMetric] = useState<ScoreMetricSchema>({ name: '', weightage: 0 });
  const [mutex, setMutex] = useState(false);
  const currentOrg = useSelector(currentOrgSelector);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRound({ ...round, [e.target.name]: e.target.value });
  };

  const handleMetricChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMetric({ ...newMetric, [e.target.name]: e.target.value });
  };

  const addMetric = () => {
    setRound({ ...round, metrics: [...round.metrics, newMetric] });
    setNewMetric({ name: '', weightage: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Adding new round...');

    try {
      const res = await fetch(`${ORG_URL}/10da7cce-306f-4e9b-b47c-94ec3fb642c5/hackathons/${hackathonId}/round`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(round),
      });

      const data = await res.json();

      if (res.ok) {
        Toaster.stopLoad(toaster, 'Round added successfully!', 1);
        onRoundAdded(data.round);
        setRound({
          startTime: '',
          endTime: '',
          judgingStartTime: '',
          judgingEndTime: '',
          metrics: [],
        });
      } else {
        Toaster.stopLoad(toaster, data.message || SERVER_ERROR, 0);
      }
    } catch (error) {
      Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }

    setMutex(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
          Start Time
        </label>
        <input
          id="startTime"
          name="startTime"
          type="datetime-local"
          value={round.startTime}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
          End Time
        </label>
        <input
          id="endTime"
          name="endTime"
          type="datetime-local"
          value={round.endTime}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="judgingStartTime" className="block text-sm font-medium text-gray-700">
          Judging Start Time
        </label>
        <input
          id="judgingStartTime"
          name="judgingStartTime"
          type="datetime-local"
          value={round.judgingStartTime}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="judgingEndTime" className="block text-sm font-medium text-gray-700">
          Judging End Time
        </label>
        <input
          id="judgingEndTime"
          name="judgingEndTime"
          type="datetime-local"
          value={round.judgingEndTime}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Metrics</label>
        {round.metrics.map((metric, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <input
              value={metric.name}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
            />
            <input
              value={metric.weightage}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
            />
          </div>
        ))}
        <div className="flex items-center space-x-2 mt-2">
          <input
            name="name"
            placeholder="Metric name"
            value={newMetric.name}
            onChange={handleMetricChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <input
            name="weightage"
            type="number"
            placeholder="Weightage"
            value={newMetric.weightage}
            onChange={handleMetricChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button
            type="button"
            onClick={addMetric}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Metric
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={mutex}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add Round
      </button>
    </form>
  );
}
