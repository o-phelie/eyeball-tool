import React from 'react';

const InfoLink = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mt-8 text-[10pt] font-['Outfit'] opacity-60 hover:opacity-100 transition-opacity duration-300 tracking-wide"
      style={{ color: '#051953' }}
    >
      what is pomodoro
    </button>
  );
};

export default InfoLink;