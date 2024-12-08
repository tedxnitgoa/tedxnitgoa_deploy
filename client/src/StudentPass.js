import React from "react";
import "./App.css";

const StudentPass = () => {
  return (
    <div className="student-pass-card">
      <h2 className="title">Student Pass</h2>
      <p className="price">₹ 1,200</p>
      <p className="price-note">Inc. GST</p>

      <ul className="features">
        <li className="included">✔ Conference Attendance</li>
        <li className="included">✔ Invitation to workshops</li>
        <li className="included">✔ Event Stationery</li>
        <li className="included">✔ Lunch</li>
        <li className="not-included">✘ Goodie Bag</li>
        <li className="not-included">✘ Early Theatre Access</li>
        <li className="not-included">✘ Access to Speakers on event day</li>
        <li className="not-included">✘ Invitation to Private Workshops</li>
        <li className="not-included">✘ Post-Conference Speaker Dinner</li>
        <li className="not-included">
          ✘ Contribute for One Student's Learnings
        </li>
      </ul>
    </div>
  );
};

export default StudentPass;
