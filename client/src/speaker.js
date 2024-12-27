import React, { useState } from "react";
import "./App.css";

const profiles = [
    {
        name: "Mr. Niren Bhatt",
        image: "/speakers/niran.png",
        description: "Screenwriter and Lyricist Writer of first 3000+ episodes of famous sitcom Tarak Mehta ka Oolta Chashma. Writer of superhit movies like Stree 2, Bhediya, Munjiya, Made in China, Bala, etc. Writer of superhit series like Asur, Insider Edge, Ray, etc.",
    },
  {
      name: "Dr. Gajendra Purohit",
      image: "/speakers/gajendraop.png",
      description: " Founder: MathsCare.Educator, Youtuber, Entrepreneur, Motivational Speaker.20+ years of math teaching experiencSix bestselling books Expert courses for IIT JAM, CSIR NET, GATE, and more.",
  },
  {
      name: "Ms. Kezaia Caldeira",
      image: "/speakers/missgoa.png",
      description: "EMiss Goa 2014 World City Queen 2016 Lifestyle Influencer Content creator with over 123k followers on instagram.",
  },
  {
      name: "Mr. Jagdeep Singh",
      image: "/speakers/jagdeep.png",
      description: "Civil Servant Dept. of Industries & Commerce J&K JKAS (Jammu Kashmir Administrative Service) NIT Srinagar Alumni TEDx Speaker.",
  },
  {
      name: "Dr. Nikhil Unnava",
      image: "/speakers/nikhilunnava.png",
      description: "Orthopedic Surgeon at AIIMS Bhuvneshwar. Participated in first full - Forearm transplantation in Odisha SICOT, Hungary - (Speaker) M.S. Orthopedics Gold Medalist from PGIMER, MBBS from AFMC Pune",
  },
  {
      name: "Mr. Nikhil J Isaac",
      image: "/speakers/nikhiliac.png",
      description: "Business Strategy Specialist Real Estate Leader PropTech & Hospitality Leader Strategic Marketing Specialist 14 years of industry experience Author Dual degree in Civil Engineering.",
  },
  {
      name: "Ms. Charu Mishra",
      image: "/speakers/charu.png",
      description: " COO at Dholakia Foundation Social Impact Analyst, Development Professional, Youth and Women Engagement.",
  },
  {
      name: "Mr. Punit G",
      image: "/speakers/punit.png",
      description: "Entrepreneur  CEO at ArthNirmiti, CXO at Choice International Ltd., Ex-VP at OYO, IIM-A Alumni, Veterinarian.",
  },
];


function Speaker() {
  const [selectedProfile, setSelectedProfile] = useState(null);

  const openProfile = (profile) => {
      setSelectedProfile(profile); // Set the profile details for the modal
  };

  const closeProfile = () => {
      setSelectedProfile(null); // Close the modal
  };

  return (
      <div>
        <h2 className="section-title">Speakers 2025</h2>
          {/* Speakers Grid */}
          <div className="speakers-grid">
              {profiles.map((profile, index) => (
                  <div className="speaker-card" key={index}>
                      <img src={profile.image} alt={profile.name} className="speaker-image" />
                      <div className="speaker-name">{profile.name}</div>
                      {/* Icon Clickable */}
                      <div
                          className="speaker-icon"
                          onClick={() => openProfile(profile)} // Open modal for this profile
                      >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="white"
                              width="40px"
                              height="40px"
                          >
                              <path d="M14 3v2h3.586L9 13.586 10.414 15 18 7.414V11h2V3h-8zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7H5V5z" />
                          </svg>
                      </div>
                  </div>
              ))}
          </div>

          {/* Modal */}
          {selectedProfile && (
              <div className="modal-overlay" onClick={closeProfile}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <span className="close-button" onClick={closeProfile}>
                          &times;
                      </span>
                      <img src={selectedProfile.image} alt={selectedProfile.name} className="modal-image" />
                      <h2>{selectedProfile.name}</h2>
                      <p>{selectedProfile.description}</p> {/* Display unique details */}
                  </div>
              </div>
          )}
      </div>
  );
}

export default Speaker;