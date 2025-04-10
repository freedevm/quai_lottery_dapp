import { useState } from 'react';

interface NumberCounterProps {
  min?: number;
  max?: number;
  initialValue?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export default function NumberCounter({
  min = 0,
  max = 100,
  initialValue = 0,
  onChange,
  className = '',
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
    <div className={`flex w-full max-w-xs ${className}`}>
      <div className="inline-flex items-stretch rounded-lg overflow-hidden">
        <button
          onClick={handleDecrement}
          disabled={count <= min}
          className="w-7 h-10 flex items-center justify-center bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          -
        </button>
        
        <input
          type="number"
          value={count}
          onChange={handleChange}
          min={min}
          max={max}
          className="w-14 h-10 text-center bg-white text-black border-none focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        
        <button
          onClick={handleIncrement}
          disabled={count >= max}
          className="w-7 h-10 flex items-center justify-center bg-purple-600 text-white font-semibold hover:bg-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          +
        </button>
      </div>
    </div>
  );
}