import React from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

const ReplyEditor = ({ value, onChange, onSubmit, isSubmitting }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-1">
        <textarea
          rows={4}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="Write your reply..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={!value.trim() || isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          <PaperAirplaneIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          {isSubmitting ? 'Submitting...' : 'Post Reply'}
        </button>
      </div>
    </form>
  );
};

export default ReplyEditor;
