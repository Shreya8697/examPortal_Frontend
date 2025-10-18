import React, { useState, useRef, useEffect } from 'react';
import './style.css';

const Calculator = ({ onClose }) => {
  // const [input, setInput] = useState('');
  const [memory, setMemory] = useState(0);
  const calculatorRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Draggable functionality
  const handleMouseDown = (e) => {
    if (e.target.className.includes('ti-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

const [input, setInput] = useState(() => {
  return localStorage.getItem("calcInput") || "";
});

useEffect(() => {
  localStorage.setItem("calcInput", input);
}, [input]);


  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Calculator functions
const handleButtonClick = (value) => {
  const operators = ['+', '-', '*', '/'];
  const lastChar = input.slice(-1);

  if (input === 'Error') {
    setInput('');
    return;
  }

  // 1. If input is empty, allow +, -, . or numbers
  if (input === '') {
    if (!isNaN(value) || value === '.' || value === '+' || value === '-') {
      setInput(value);
    }
    return;
  }

  // 2. At the very beginning, if input is + or -, allow overwrite only with + or -
  if ((input === '+' || input === '-') && (value === '+' || value === '-')) {
    setInput(value); // Replace + with - or vice versa
    return;
  }

  // ❌ Prevent overwrite with * or / at beginning like: + → *
  if ((input === '+' || input === '-') && (value === '*' || value === '/')) {
    return;
  }

  // 3. After number, if last is operator and new value is operator → overwrite
  if (operators.includes(lastChar) && operators.includes(value)) {
    setInput(prev => prev.slice(0, -1) + value);
    return;
  }

  // 4. Append normally
  setInput(prev => prev + value);
};





  const calculateResult = () => {
    try {
      // Replace × with * for proper evaluation
      const sanitizedInput = input.replace(/×/g, '*');
      const result = eval(sanitizedInput);
      
      // Format to 5 decimal places and remove trailing zeros
      const formattedResult = Number.isInteger(result) 
        ? result.toString()
        : parseFloat(result.toFixed(5)).toString();
      
      setInput(formattedResult);
    } catch {
      setInput('Error');
    }
  };
  
  const clearInput = () => {
    setInput('');
    setLastOperation(null);
  };

  const memoryRecall = () => {
    setInput(memory.toString());
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const memoryAdd = () => {
    try {
      const current = input ? eval(input) : 0;
      setMemory(prev => prev + current);
      setInput('');
    } catch {
      setInput('Error');
    }
  };

  const memorySubtract = () => {
    try {
      const current = input ? eval(input) : 0;
      setMemory(prev => prev - current);
      setInput('');
    } catch {
      setInput('Error');
    }
  };

  const handleSquareRoot = () => {
    try {
      const value = input ? eval(input) : 0;
      if (value < 0) {
        setInput('Error');
        return;
      }
      setInput(Math.sqrt(value).toString());
    } catch {
      setInput('Error');
    }
  };

  const handlePercentage = () => {
    try {
      const value = input ? eval(input) : 0;
      setInput((value / 100).toString());
    } catch {
      setInput('Error');
    }
  };

  const handleSignChange = () => {
    try {
      const value = input ? eval(input) : 0;
      setInput((value * -1).toString());
    } catch {
      setInput('Error');
    }
  };

  return (
        <div 
          className="ti-calculator"
          ref={calculatorRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
          <div 
            className="ti-header"
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className="ti-brand">Maxiwise Learning</div>
            <div className="ti-model">TI-108</div>
            <button className="ti-close" onClick={onClose}>×</button>
          </div>

      <div className="ti-display">{input || '0'}</div>

      <div className="ti-keypad">
        <button onClick={handleSignChange}>+/-</button>
        <button onClick={handleSquareRoot}>√</button>
        <button onClick={handlePercentage}>%</button>
        <button onClick={() => handleButtonClick('/')}>÷</button>

        <button onClick={memoryRecall}>MRC</button>
        <button onClick={memorySubtract}>M-</button>
        <button onClick={memoryAdd}>M+</button>
        <button onClick={clearInput}>C</button>

        <button onClick={() => handleButtonClick('7')}>7</button>
        <button onClick={() => handleButtonClick('8')}>8</button>
        <button onClick={() => handleButtonClick('9')}>9</button>
        <button onClick={() => handleButtonClick('*')}>×</button>

        <button onClick={() => handleButtonClick('4')}>4</button>
        <button onClick={() => handleButtonClick('5')}>5</button>
        <button onClick={() => handleButtonClick('6')}>6</button>
        <button onClick={() => handleButtonClick('-')}>-</button>

        <button onClick={() => handleButtonClick('1')}>1</button>
        <button onClick={() => handleButtonClick('2')}>2</button>
        <button onClick={() => handleButtonClick('3')}>3</button>
        <button onClick={() => handleButtonClick('+')}>+</button>

        <button onClick={clearInput} className="ti-on">ON/C</button>
        <button onClick={() => handleButtonClick('0')}>0</button>
        <button onClick={() => handleButtonClick('.')}>.</button>
        <button className="itqal" onClick={calculateResult}>=</button>
      </div>
    </div>
  );
};

export default Calculator;