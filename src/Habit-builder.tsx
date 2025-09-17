import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Calendar, Trash2, Target, Flame } from 'lucide-react';

interface Habit {
  id: number;
  name: string;
  streak: number;
  completions: Record<string, boolean>;
}


const HabitBuilder = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Initialize with sample data if no habits exist
  useEffect(() => {
    if (habits.length === 0) {
      const sampleHabits = [
        {
          id: 1,
          name: 'Drink 8 glasses of water',
          streak: 5,
          completions: {
            '2025-09-16': true,
            '2025-09-15': true,
            '2025-09-14': true,
            '2025-09-13': false,
            '2025-09-12': true
          }
        },
        {
          id: 2,
          name: 'Exercise for 30 minutes',
          streak: 3,
          completions: {
            '2025-09-16': false,
            '2025-09-15': true,
            '2025-09-14': true,
            '2025-09-13': true,
            '2025-09-12': false
          }
        }
      ];
      setHabits(sampleHabits);
    }
  }, []);

  const addHabit = () => {
    if (newHabitName.trim()) {
      const newHabit = {
        id: Date.now(),
        name: newHabitName.trim(),
        streak: 0,
        completions: {}
      };
      setHabits([...habits, newHabit]);
      setNewHabitName('');
      setShowAddForm(false);
    }
  };

  const deleteHabit = (id: number) => {
  setHabits(habits.filter(habit => habit.id !== id));
};

const toggleHabitCompletion = (id: number, date: string) => {
  setHabits(habits.map(habit => {
    if (habit.id === id) {
      const updatedCompletions = { ...habit.completions };
      const wasCompleted = updatedCompletions[date];
      updatedCompletions[date] = !wasCompleted;

      // Recalculate streak
      const today = new Date().toISOString().split('T')[0];
      let streak = 0;
      let currentDate = new Date(today);

      while (updatedCompletions[currentDate.toISOString().split('T')[0]]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }

      return {
        ...habit,
        completions: updatedCompletions,
        streak
      };
    }
    return habit;
  }));
};

  const getDateString = (daysBack = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - daysBack);
    return date.toISOString().split('T')[0];
  };

  const getDateDisplay = (daysBack = 0) => {
    const date = new Date();
    date.setDate(date.getDate() - daysBack);
    if (daysBack === 0) return 'Today';
    if (daysBack === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

 const getCompletionRate = (habit: Habit): number => {
  const completions = Object.values(habit.completions);
  if (completions.length === 0) return 0;
  const completed = completions.filter(Boolean).length;
  return Math.round((completed / completions.length) * 100);
};

  const totalHabits = habits.length;
  const totalCompletionsToday = habits.filter(habit => 
    habit.completions[getDateString(0)]
  ).length;
  const averageStreak = totalHabits > 0 ? 
    Math.round(habits.reduce((sum, habit) => sum + habit.streak, 0) / totalHabits) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Habit Builder
          </h1>
          <p className="text-gray-600 text-lg">Build better habits, one day at a time</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Habits</p>
                <p className="text-3xl font-bold text-indigo-600">{totalHabits}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed Today</p>
                <p className="text-3xl font-bold text-green-600">{totalCompletionsToday}/{totalHabits}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg Streak</p>
                <p className="text-3xl font-bold text-orange-600">{averageStreak} days</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Habit Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-indigo-300 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              Add New Habit
            </button>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Enter habit name (e.g., Read for 30 minutes)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={addHabit}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
                >
                  Add Habit
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewHabitName('');
                  }}
                  className="flex-1 bg-gray-100 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Habits List */}
        <div className="space-y-4">
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No habits yet</h3>
              <p className="text-gray-500">Add your first habit to get started on your journey!</p>
            </div>
          ) : (
            habits.map(habit => (
              <div key={habit.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{habit.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          {habit.streak} day streak
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-indigo-500" />
                          {getCompletionRate(habit)}% completion rate
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 7-day tracking grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = getDateString(6 - i);
                      const isCompleted = habit.completions[date];
                      const isToday = i === 6;
                      
                      return (
                        <div key={i} className="text-center">
                          <div className="text-xs text-gray-500 mb-2">
                            {getDateDisplay(6 - i)}
                          </div>
                          <button
                            onClick={() => toggleHabitCompletion(habit.id, date)}
                            className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                              isCompleted
                                ? 'bg-green-500 border-green-500 text-white'
                                : isToday
                                ? 'border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {isCompleted && <Check className="w-5 h-5" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Track your habits daily and build consistency over time</p>
        </div>
      </div>
    </div>
  );
};

export default HabitBuilder;