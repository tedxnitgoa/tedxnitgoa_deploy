
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from "react-router-dom";
import AudienceStats from './AudienceStats'; 

// SponsorWheel Component
const SponsorWheel = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  const sections = [
    {
      title: 'Brand Visibility',
      description: 'Enhance your brand presence through TEDx\'s global platform. Your logo and brand will be prominently featured across all event materials, social media channels, and live presentations, reaching a highly engaged audience of thought leaders and innovators.',
      color: 'rgb(255, 99, 99)'
    },
    {
      title: 'Supporting Innovation',
      description: 'Play a crucial role in fostering innovation and ideas worth spreading. Your support enables groundbreaking talks, workshops, and discussions that can shape the future at NIT Goa.',
      color: 'rgb(255, 45, 45)'
    },
    {
      title: 'Social Impact',
      description: 'Create lasting positive change in society through your sponsorship. Support the spread of transformative ideas that can impact education, technology, healthcare, and more within the NIT Goa community.',
      color: 'rgb(255, 99, 99)'
    },
    {
      title: 'Networking',
      description: 'Gain exclusive access to a network of industry leaders, innovators, and influential thinkers. Connect with the brightest minds from NIT Goa and beyond through special networking sessions and VIP events.',
      color: 'rgb(255, 45, 45)'
    },
    {
      title: 'Access to Talent',
      description: 'Connect with exceptional talent from NIT Goa. Our events attract the brightest engineering minds and future leaders, providing unique opportunities for recruitment and collaboration.',
      color: 'rgb(255, 99, 99)'
    }
  ];

  return (
    <div className="sponsor-wheel-container">
      <div className="wheel-container">
        <svg 
          viewBox="0 0 400 400" 
          className="wheel-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <circle cx="200" cy="200" r="80" fill="white" />
          <text x="200" y="185" textAnchor="middle" className="wheel-center-text" fill="black">Why Sponsor</text>
          <text x="200" y="210" textAnchor="middle" className="wheel-center-text" fill="rgb(255, 45, 45)">TEDxNIT Goa</text>
          <text x="200" y="235" textAnchor="middle" className="wheel-center-text" fill="black">?</text>

          {sections.map((section, index) => {
            const angle = (index * 72 - 90) * (Math.PI / 180);
            const startAngle = angle;
            const endAngle = angle + (Math.PI * 2) / 5;
            
            const x1 = 200 + Math.cos(startAngle) * 80;
            const y1 = 200 + Math.sin(startAngle) * 80;
            const x2 = 200 + Math.cos(startAngle) * 180;
            const y2 = 200 + Math.sin(startAngle) * 180;
            const x3 = 200 + Math.cos(endAngle) * 180;
            const y3 = 200 + Math.sin(endAngle) * 180;
            const x4 = 200 + Math.cos(endAngle) * 80;
            const y4 = 200 + Math.sin(endAngle) * 80;

            const textAngle = (startAngle + endAngle) / 2;
            const textX = 200 + Math.cos(textAngle) * 130;
            const textY = 200 + Math.sin(textAngle) * 130;
            const textRotation = (index * 72 + 0) % 360;

            return (
              <g 
                key={index} 
                onClick={() => setSelectedSection(section)} 
                className="cursor-pointer"
                style={{ transform: 'translate(0, 0)' }} // Prevents scaling issues
              >
                {/* Invisible larger clickable area */}
                <path
                  d={`M ${x1} ${y1} L ${x2} ${y2} A 180 180 0 0 1 ${x3} ${y3} L ${x4} ${y4} A 80 80 0 0 0 ${x1} ${y1}`}
                  fill="transparent"
                  stroke="transparent"
                  strokeWidth="30"
                  className="cursor-pointer"
                />
                {/* Visible section */}
                <path
                  d={`M ${x1} ${y1} L ${x2} ${y2} A 180 180 0 0 1 ${x3} ${y3} L ${x4} ${y4} A 80 80 0 0 0 ${x1} ${y1}`}
                  fill={selectedSection?.title === section.title ? 'rgb(185, 28, 28)' : section.color}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-colors duration-300"
                />
                <g transform={`rotate(${textRotation}, ${textX}, ${textY})`}>
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    fill="white"
                    className="text-sm font-medium pointer-events-none select-none"
                    style={{ 
                      transform: `rotate(${-textRotation}deg)`,
                      transformOrigin: `${textX}px ${textY}px`
                    }}
                  >
                    {section.title.split(' ').map((word, i) => (
                      <tspan 
                        key={i} 
                        x={textX} 
                        dy={i ? '1.2em' : 0}
                        style={{
                          fontSize: section.title.length > 10 ? '0.9em' : '1em'
                        }}
                      >
                        {word}
                      </tspan>
                    ))}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ padding: '2rem' }}>
        <div className={`bg-black bg-opacity-70 rounded-lg p-6 transition-all duration-300 ${selectedSection ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          {selectedSection ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-red-500">{selectedSection.title}</h2>
              <p className="text-white leading-relaxed">{selectedSection.description}</p>
            </div>
          ) : (
            <div className="text-center text-gray-300">
              <p>Click any section of the wheel to learn more about sponsorship benefits</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Our sponsors


const Card = ({ title, description, date, imageUrl }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div ref={cardRef} style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
      background: '#313236',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      margin: '1rem',
      width : '300px',
      minHeight: '400px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection:'column',
      justifyContent:'center',
    }}>
      <img src={imageUrl} alt={title} style={{
        width: '100%',
        height: '150px',
        objectFit: 'cover',
      }} />
      <h3 style={{ color: 'red', margin: '2rem 0',paddingLeft:'20px'}}>{title}</h3>
      <p style={{ padding: '0 1rem', color: '#fff' }}>{description}</p>
      <p style={{ margin: '0.5rem 0', color: '#666' }}>{date}</p>
    </div>
  );
};

const EventReachSection = () => {
  return (
    <section style={{ backgroundColor: '#2A2B2F', padding: '3rem 0', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color:'#fff'}}>Event Reach and Impact</h2>
      <p style={{ width: '60%', margin: '0 auto', marginBottom: '3rem', color: '#b8b8b8' }}>
        TEDxNITGoa offers access to a dynamic audience building 
      </p>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>

        <div style={{ textAlign: 'center' }}>
          <img src="/attendance.png" alt="Attendees" style={{ height: '60px' }} />
          <h3 style={{ fontSize: '1.5rem', marginTop: '1rem',color:'#eeeeee' }}>Attendees</h3>
          <p style={{ color: '#b8b8b8', marginTop: '0.5rem' }}>Over 1000+ students from NIT Goa and across India</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <img src="/crowd-of-users (1).png" alt="Social Reach" style={{ height: '60px' }} />
          <h3 style={{ fontSize: '1.5rem', marginTop: '1rem',color:'#eeeeee' }}>Social Groups</h3>
          <p style={{ color: '#b8b8b8', marginTop: '0.5rem' }}>Students,Faculty,Entreprenuers and Industry Professionals</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <img src="youtube.png" alt="YouTube Views" style={{ height: '60px' }} />
          <h3 style={{ fontSize: '1.5rem', marginTop: '1rem',color:'#eeeeee' }}>Live Stream</h3>
          <p style={{ color: '#b8b8b8', marginTop: '0.5rem' }}>Livestreaming benefits with real-time engagement</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <img src="/instagram.png" alt="Impressions" style={{ height: '60px' }} />
          <h3 style={{ fontSize: '1.5rem', marginTop: '1rem',color:'#eeeeee' }}>Social Media</h3>
          <p style={{ color: '#b8b8b8', marginTop: '0.5rem' }}>Access to social media platforms</p>
        </div>
      </div>
    </section>
  );
};

const Sponsors = () => {
  const sponsorsData = {
    platinum: [
      {
        title: 'Pratham Industries',
        description: '',
        imageUrl: '/platinum_pratham.jpg',
      },
      {
        title: 'Mall De Goa',
        description: '',
        imageUrl: '/malldegoa_platinum.png',
      },
      {
        title: 'Shreeji Group',
        description: '',
        imageUrl: '/shreeji_platinum.png',
      },
      {
        title: 'Mayur',
        description: '',
        imageUrl: '/mayur_platinum.jpg',
      },
    ],
    gold: [
      {
        title: 'Paras Metal Industries',
        description: '',
        imageUrl: '/Paras_indus_gold.jpg',
      },
    ],
    silver: [
      {
        title: 'DNH Electricals',
        description: '',
        imageUrl: '/dnnelec_gold.png',
      },
    ],
    bronze: [
      {
        title: 'Konark Research Foundation',
        description: '',
        imageUrl: '/konak_bronze.jpg',
      },
      {
        title: 'Nagjua',
        description: '',
        imageUrl: '/nagajjuna_bronze.png',
      },
    ],
  };

  const SponsorSection = ({ title, sponsors }) => (
    <section style={{ padding: '2rem 0', backgroundColor: '#1a1a1a' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', color: '#fff', marginBottom: '1.5rem' }}>
        {title}
      </h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {sponsors.map((sponsor, index) => (
          <Card key={index} {...sponsor} />
        ))}
      </div>
    </section>
  );

  return (
    <div className="sponsors">
      <section className="partners_centering__mEmQ2">
        <div
          className="partners_title__cWB8o"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '80vw',
            color: 'white',
          }}
        >
          <span>Partner with TEDxNIT Goa</span>
        </div>
        <p
          className="sponsors_para"
          style={{
            width: '65vw',
            color: 'white',
          }}
        >
          <span className="partners_content__XGtJa" style={{ color: 'white' }}>
            Join TEDxNITGoa as a sponsor to support innovation and engage with some of the brightest minds in the
            country. NIT Goa, a top technical institute, offers unparalleled brand visibility and a chance to connect
            with future leaders, engineers, and entrepreneurs shaping the future.
          </span>
        </p>
        <a className="partners_button__nkcDD" href="https://forms.gle/Py4gC3igyZgdD7HU7">
          <span>Sponsor TEDxNIT Goa</span>
        </a>
      </section>

      <section
        style={{
          background: 'rgba(0, 0, 0, 0.9)',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 0',
        }}
      >
        <SponsorWheel />
      </section>

      {/* Event Reach Section */}
      <EventReachSection />

      {/* Platinum Sponsors */}
      <SponsorSection title="Platinum Sponsors" sponsors={sponsorsData.platinum} />

      {/* Gold Sponsors */}
      <SponsorSection title="Gold Sponsors" sponsors={sponsorsData.gold} />

      {/* Silver Sponsors */}
      <SponsorSection title="Silver Sponsors" sponsors={sponsorsData.silver} />

      {/* Bronze Sponsors */}
      <SponsorSection title="Bronze Sponsors" sponsors={sponsorsData.bronze} />

      {/* Our Sponsors */}
    </div>
  );
};


export default Sponsors;