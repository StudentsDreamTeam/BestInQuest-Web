import './Header.css';
// import React, { useState, useEffect } from 'react';

export default function Header() {
//   const [ currentDate, setCurrentDate ] = useState('');

//   useEffect(() => {
//     const updateDate = () => {
//         const now = new Date();
//         const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//         setCurrentDate(now.toLocaleDateString('ru-RU', options));
//     };

//     updateDate();
//     // Обновлять дату каждый день в 00:00
//     const interval = setInterval(updateDate, 86400000);
//     return () => clearInterval(interval);
//   }, []);

  return (
    <header className="header">
      <div className="logo">BestInQuest</div>

      <div className="current-date">Date : 1 May</div>
      {/* <div className="current-date">{currentDate}</div> */}
    </header>
  );
};
