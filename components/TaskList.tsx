import React, { useState, useMemo } from 'react';
import { Task, FilterType, SortType, Mode } from '../types';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (text: string, estimatedTime?: number) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  currentMode: Mode;
  secondsLeft: number;
  totalSecondsForMode: number;
}

const TrashIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.716c-1.126 0-2.036.954-2.036 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask, currentMode, secondsLeft, totalSecondsForMode }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('date');
  const [toggledTaskId, setToggledTaskId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const estimate = timeEstimate ? parseInt(timeEstimate, 10) : undefined;
    onAddTask(newTaskText, estimate);
    setNewTaskText('');
    setTimeEstimate('');
  };

  const handleToggle = (id: string) => {
    onToggleTask(id);
    setToggledTaskId(id);
    setTimeout(() => setToggledTaskId(null), 500); // Duration matches CSS animation
  };
  
  const displayedTasks = useMemo(() => {
    const filteredTasks = tasks.filter(task => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });

    if (sort === 'alphabetical') {
      return [...filteredTasks].sort((a, b) => a.text.localeCompare(b.text));
    }
    
    if (sort === 'time') {
      return [...filteredTasks].sort((a, b) => {
        const timeA = a.estimatedTime ?? Infinity;
        const timeB = b.estimatedTime ?? Infinity;
        return timeA - timeB;
      });
    }

    return filteredTasks; // Default 'date' sort is the creation order
  }, [tasks, filter, sort]);

  return (
    <div className="w-full max-w-lg bg-gray-800/50 rounded-lg p-4 md:p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Tasks</h2>
      
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-400 focus:outline-none transition-shadow"
          aria-label="New task input"
        />
        <input
          type="number"
          min="1"
          value={timeEstimate}
          onChange={(e) => setTimeEstimate(e.target.value)}
          placeholder="Mins"
          className="w-20 bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-400 focus:outline-none transition-shadow"
          aria-label="Estimated time in minutes"
        />
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!newTaskText.trim()}
          aria-label="Add new task"
        >
          Add
        </button>
      </form>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center bg-gray-700/60 rounded-full p-1 text-sm">
          {(['all', 'active', 'completed'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full transition-colors capitalize ${filter === f ? 'bg-red-500 text-white shadow' : 'text-gray-400 hover:bg-gray-600/50'}`}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="appearance-none bg-gray-700/60 border border-gray-600 rounded-md pl-3 pr-8 py-1 text-sm text-white focus:ring-2 focus:ring-red-400 focus:outline-none transition-shadow"
            aria-label="Sort tasks"
          >
            <option value="date">Sort by Date</option>
            <option value="alphabetical">Sort Alphabetically</option>
            <option value="time">Sort by Time</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {displayedTasks.length > 0 ? (
          displayedTasks.map(task => {
            const showProgressBar = currentMode === Mode.Pomodoro && task.estimatedTime && !task.completed;
            let progress = 0;
            if (showProgressBar && task.estimatedTime) {
                const elapsedSeconds = totalSecondsForMode - secondsLeft;
                const taskTotalSeconds = task.estimatedTime * 60;
                progress = Math.min(100, (elapsedSeconds / taskTotalSeconds) * 100);
            }

            return (
              <div key={task.id} className={`p-3 rounded-md group transition-colors ${toggledTaskId === task.id ? 'animate-toggle' : 'bg-gray-700/50'}`}>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggle(task.id)}
                        className="form-checkbox h-5 w-5 rounded text-red-400 bg-gray-800 border-gray-600 focus:ring-red-400 focus:ring-offset-gray-700/50 cursor-pointer"
                        aria-labelledby={`task-text-${task.id}`}
                    />
                    <span 
                        id={`task-text-${task.id}`}
                        className={`ml-3 flex-grow ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'} transition-colors`}
                    >
                        {task.text}
                    </span>
                    {task.estimatedTime && (
                        <span className="text-sm text-gray-400 ml-3 whitespace-nowrap">
                        {task.estimatedTime} min
                        </span>
                    )}
                    <button
                        onClick={() => onDeleteTask(task.id)}
                        className="ml-3 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Delete task: ${task.text}`}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
                {showProgressBar && (
                    <div className="mt-2 w-full bg-gray-600 rounded-full h-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                        <div 
                            className="bg-red-400 h-1.5 rounded-full transition-all duration-500 ease-linear" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}
              </div>
            )
          })
        ) : (
          <p className="text-gray-500 text-center py-4">
            {tasks.length > 0 ? 'No tasks match your current filter.' : 'No tasks yet. Add one to get started!'}
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskList;