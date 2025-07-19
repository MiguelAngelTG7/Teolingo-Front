// src/components/QuestionCard.jsx
import { useState } from 'react';

export default function QuestionCard({ questionData, onSubmit }) {
  const [selected, setSelected] = useState(null);

  const handleOptionClick = (index) => {
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected !== null) {
      onSubmit(selected);
    }
  };

  return (
    <div className="question-card">
      <h2>{questionData.question}</h2>
      <ul>
        {questionData.options.map((option, index) => (
          <li
            key={index}
            onClick={() => handleOptionClick(index)}
            style={{
              backgroundColor: selected === index ? '#d1e7dd' : '#f8f9fa',
              padding: '10px',
              margin: '5px 0',
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          >
            {option}
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        disabled={selected === null}
        style={{ marginTop: '10px' }}
      >
        Enviar
      </button>
    </div>
  );
}
