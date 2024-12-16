import React from "react";
import "./App.css";

const StudentPassvip = () => {
  return (
    <div className="student-pass-card">
      <h2 className="title">VIP Pass</h2>
      <p className="price">₹ 949</p>
      <p className="price-note"></p>

      <ul className="features">
        <li className="included">✔ Conference Attendance</li>
        <li className="included">✔ Goodies</li>
        <li className="included">✔ Lunch</li>
        <li className="included">✔ 1-on-1 interaction with all speakers</li>
        <li className="included">✔ the chance to grab a selfie with them</li>
      </ul>
    </div>
  );
};

export default StudentPassvip;
