import React, { useState, useEffect } from 'react';
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './App.css'; // Import your CSS file for styling

const AboutUsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3; // Adjust this based on the total number of slides

  // Define your slides array
  const slides = [
    {
      id: 1,
      content: 'Content 1',
      description: 'TEDxNITGOA is an annual independently organised TEDx event that first started in 2016. Run entirely by a team of passionate volunteers, including undergraduate and post-graduate NIT GOA students, TEDxNITGOA brings a TED-like experience to the NIT GOA and wider Indian communities. TEDxNITGOA is an immersive event created to stimulate dialogue through engaging talks and session breaks designed to give individuals and organizations in India a platform to meet, share ideas and collaborate.',
      imageUrl: './Images/AboutUs/TEDx.jpeg', // Replace with the actual image URL
      link: 'https://www.youtube.com/watch?v=d0NHOpeczUU'
    },
    {
      id: 2,
      content: 'Content 2',
      description: 'TEDxNITGOA is an annual independently organised TEDx event that first started in 2016. Run entirely by a team of passionate volunteers, including undergraduate and post-graduate NIT GOA students, TEDxNITGOA brings a TED-like experience to the NIT GOA and wider Indian communities. TEDxNITGOA is an immersive event created to stimulate dialogue through engaging talks and session breaks designed to give individuals and organizations in India a platform to meet, share ideas and collaborate.',
      imageUrl: './Images/AboutUs/TED.jpeg', // Replace with the actual image URL
      link: 'https://www.youtube.com/watch?v=d0NHOpeczUU'
    },
    {
      id: 3,
      content: 'Content 3',
      description: 'TEDxNITGOA is an annual independently organised TEDx event that first started in 2016. Run entirely by a team of passionate volunteers, including undergraduate and post-graduate NIT GOA students, TEDxNITGOA brings a TED-like experience to the NIT GOA and wider Indian communities. TEDxNITGOA is an immersive event created to stimulate dialogue through engaging talks and session breaks designed to give individuals and organizations in India a platform to meet, share ideas and collaborate.',
      imageUrl: './Images/AboutUs/TEDxWomen.jpeg', // Replace with the actual image URL
      link: 'https://www.youtube.com/watch?v=d0NHOpeczUU'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === totalSlides - 1 ? 0 : prevSlide + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? totalSlides - 1 : prevSlide - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
    }, 5000); // Adjust the interval duration as needed (in milliseconds)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="aboutUs_outerbox__iGhTQ">
      <div className="carousel-root">
        <div className="outerCarousel">
        <div className="carousel carousel-slider" style={{width:'80%', paddingLeft:'10%',paddingRight:'10%', display:'grid'}}>   
        <img src='/left.png' className='leftarrow' alt='' onClick={prevSlide}></img>

          <div className="slider-wrapper axis-horizontal">
            <ul className="slider animated" style={{ transform: `translateX(-${currentSlide * 100}%)`, transitionDuration: '350ms' }}>
              {slides.map((slide) => (
                <li key={slide.id} className={`slide ${currentSlide === slide.id - 1 ? 'selected' : ''}`}>
                  <div>
                    <h3>{slide.content}</h3>
                    <p>{slide.description}</p>
                    <img src={slide.imageUrl} alt={`Slide ${slide.id}`} />
                    <a href={slide.link}>
                      <button className="AboutCarousel_button__QZSvF">
                        Know More
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="AboutCarousel_icon__KXbnM" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" color="white">
                          <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"></path>
                        </svg>

                      </button>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <img src='right.png' className='rightarrow' onClick={nextSlide} alt=''></img>

        </div>
        </div>
        {/* <button  > */}
          {/* <FaArrowLeft /> */}
        {/* </button> */}
        {/* <button  > */}
          {/* <FaArrowRight /> */}
        {/* </button> */}
      </div>
    </div>
  );
};

export default AboutUsCarousel;
