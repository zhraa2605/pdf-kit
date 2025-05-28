import React from 'react';

interface NumberInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({  onChange }) => (
  <div className="mb-4">
    <label htmlFor="numFiles" className="block text-lg font-medium text-gray-600">
      Number of Parts
    </label>
    <input
      type='number'
      inputMode='numeric'
      onChange={onChange}
      className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);