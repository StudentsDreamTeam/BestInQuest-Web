import React from 'react';
import './SidebarUserProfile.css';

export default function SidebarUserProfile({ user }) {
  return (
    <div className="user-profile">
      
      <div className="avatar">
        <img src={user.avatar} alt="User Avatar" />
      </div>

      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.level} уровень</p>
        <span className="points">{user.points} очков</span>
      </div>

    </div>
  );
}