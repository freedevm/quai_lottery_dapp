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
    
    <div className={'flex w-full max-w-xs'}>
      <div className="relative flex items-center">
        <button
          type="button"
          className={`shrink-0 bg-purple-100 dark:bg-purple-700 dark:hover:bg-purple-600 dark:border-purple-600 hover:bg-purple-200 inline-flex items-center justify-center border border-purple-300 rounded-md h-7 w-7 focus:ring-purple-100 dark:focus:ring-purple-700 focus:ring-2 focus:outline-none`}
          onClick={handleDecrement}
          disabled={count <= min}
        >
          <svg className="w-2.5 h-2.5 text-purple-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
          </svg>
        </button>
        <input 
          type="number" 
          data-input-counter 
          className="shrink-0 text-purple-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center" 
          placeholder="" 
          min={min}
          max={max}
          onChange={handleChange}
          value={count} 
          required
        />
        <button
          type="button" 
          className={`shrink-0 bg-purple-100 dark:bg-purple-700 dark:hover:bg-purple-600 dark:border-purple-600 hover:bg-purple-200 inline-flex items-center justify-center border border-purple-300 rounded-md h-7 w-7 focus:ring-purple-100 dark:focus:ring-purple-700 focus:ring-2 focus:outline-none`}
          onClick={handleIncrement}
          disabled={count >= max}
        >
          <svg className="w-2.5 h-2.5 text-purple-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
          </svg>
        </button>
      </div>
    </div>
  );
}