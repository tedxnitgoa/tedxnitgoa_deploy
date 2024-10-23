import React from 'react';

const AudienceStats = () => {
  const impactData = [
    {
      title: "Student Reach",
      stat: "1,000+",
      description: "Students from NIT Goa and across India",
    },
    {
      title: "Diverse Audience",
      stat: "4 Groups",
      description: "Students, Faculty, Entrepreneurs, and Industry Professionals",
    },
    {
      title: "Digital Presence",
      stat: "Live",
      description: "Livestreaming benefits with real-time engagement",
    },
    {
      title: "Media Coverage",
      stat: "3 Channels",
      description: "Live streaming, social media, and press coverage",
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-white tracking-tight">
            Event <span className="text-red-600">Reach</span> and{' '}
            <span className="text-red-600">Impact</span>
          </h2>
          <div className="relative pb-8">
            <div className="absolute left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent bottom-0"></div>
            <p className="text-xl sm:text-2xl font-medium text-gray-300 mb-2">
              TEDx<span className="text-red-600">NIT</span>Goa offers access to a
            </p>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              dynamic audience including:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impactData.map((item, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-black p-8"
            >
              <div className="absolute inset-px bg-gradient-to-br from-gray-800 to-transparent rounded-xl z-0"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <h3 className="font-bold text-xl mb-4 text-white group-hover:text-red-500 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-red-600 font-extrabold text-3xl sm:text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.stat}
                </p>
                <p className="text-gray-400 text-center leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="absolute inset-0 border border-gray-800 group-hover:border-red-600/50 rounded-xl transition-colors duration-500"></div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-400 italic">
            <span className="text-red-600 font-semibold">Fostering connections</span> and{' '}
            <span className="text-red-600 font-semibold">amplifying ideas</span>{' '}
            <br className="hidden sm:block" />
            across India since 2019
          </p>
        </div>
      </div>
    </section>
  );
};

export default AudienceStats;