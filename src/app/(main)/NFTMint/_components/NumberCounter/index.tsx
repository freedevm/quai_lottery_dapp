import { useState } from 'react';

interface NumberCounterProps {
  min?: number;
  max?: number;
  initialValue?: number;
  onChange?: (value: number) => void;
}

export default function NumberCounter({
  min = 0,
  max = 100,
  initialValue = 0,
  onChange,
}: NumberCounterProps) {
  const [count, setCount] = useState<number>(initialValue);

  const handleIncrement = () => {
    if (count < max) {
      const newCount = count + 1;
      setCount(newCount);
      onChange?.(newCount);
    }
  };

  const handleDecrement = () => {
    if (count > min) {
      const newCount = count - 1;
      setCount(newCount);
      onChange?.(newCount);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || min;
    if (value >= min && value <= max) {
      setCount(value);
      onChange?.(value);
    }
  };

  return (
    <div className="flex items-center space-x-2 text-black">
      <button
        onClick={handleDecrement}
        disabled={count <= min}
        className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
      >
        -
      </button>
      
      <input
        type="number"
        value={count}
        onChange={handleChange}
        min={min}
        max={max}
        className="w-20 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      <button
        onClick={handleIncrement}
        disabled={count >= max}
        className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
      >
        +
      </button>
    </div>
  );
}