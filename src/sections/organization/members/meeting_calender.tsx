import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, startOfWeek, endOfWeek, isToday, isSameMonth } from 'date-fns';
import { useRouter } from 'next/router';
import { Meeting } from '@/types';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { currentOrgSelector } from '@/slices/orgSlice';

interface MeetingCalendarProps {
  userId: string;
}

interface DayDetails {
  date: string;
  meetings: Meeting[];
}

const MeetingCalendar = ({ userId }: MeetingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthMeetings, setMonthMeetings] = useState<DayDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const currentOrg = useSelector(currentOrgSelector);

  const fetchMeetingsForMonth = async (date: Date) => {
    setLoading(true);
    const startDate = startOfMonth(date);

    try {
      const response = await axios.get(`/org/${currentOrg.id}/meetings`, {
        params: {
          date: format(startDate, 'yyyy-MM-dd'),
        },
      });

      if (response.data.status === 'success') {
        setMonthMeetings(response.data.data);
      } else {
        console.error('Failed to fetch meetings:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetingsForMonth(currentMonth);
  }, [currentMonth, userId, currentOrg.id]);

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
  const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  if (loading) return <div>Loading...</div>;

  const pastelColors = [
    'bg-pink-200',
    'bg-purple-200',
    'bg-indigo-200',
    'bg-blue-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-orange-200',
    'bg-red-200',
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4 w-full">
      <div className="w-full mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meeting Calendar</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Previous</button>
            <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
            <button onClick={handleNextMonth} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Next</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-2 font-bold text-gray-700">{day}</div>
            ))}
            {days.map((day, index) => {
              const dayDetails = monthMeetings.find(d => d.date === format(day, 'yyyy-MM-dd'));
              const dayMeetings = dayDetails ? dayDetails.meetings : [];
              return (
                <div
                  key={day.toString()}
                  className={`p-2 border rounded cursor-pointer ${
                    isToday(day) ? 'bg-blue-500 text-white' : 
                    isSameMonth(day, currentMonth) ? 'bg-gray-200' : 'bg-gray-100'
                  }`}
                >
                  {format(day, 'd')}
                  {dayMeetings.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-600 mt-1">{dayMeetings.length} meeting(s)</div>
                      <div className="flex flex-wrap mt-1">
                        {dayMeetings.map((meeting, index) => (
                          <div
                            key={meeting.id}
                            className={`w-2 h-2 rounded-full ${pastelColors[index % pastelColors.length]} mr-1 mb-1`}
                            title={meeting.title}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingCalendar;
