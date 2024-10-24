import React, { useState, useEffect, useRef } from 'react';

const Navbar = () => {
    const [showContent, setShowContent] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1100);
    const hamburgerRef = useRef(null);

    const toggleContent = () => {
        setShowContent(!showContent);
    };

    const handleClickOutside = (event) => {
        if (hamburgerRef.current && !hamburgerRef.current.contains(event.target)) {
            setShowContent(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1100);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="navbar_nav">
            <div className="navbar_left">
                <a href="/"><img src="/logonitg122.png" alt="" className="navbar_logo1__mHDkT" /></a>
            </div>
            {isMobile ? (
                <div className="innerok">
                    <div className="navbar_btn__HkUOK" ref={hamburgerRef} onClick={(e) => { toggleContent(); e.stopPropagation(); }}>
                        {!showContent && (
                            <button className="navbar_toggle__1Pu10">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512"
                                    className="navbar_ll__nKuuS" height="110em" width="110em" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="none" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="48"
                                        d="M88 152h336M88 256h336M88 360h336"></path>
                                </svg>
                            </button>
                        )}
                    </div>
                    {showContent && (

                        <div className="innerless">
                            <button className="navbar_toggle__1Pu10">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="navbar_ll__nKuuS" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path></svg>
                            </button>
                            <div className="navbar_sidehead__HVrOC">
                                <div className="navbar_head__Un2yU">
                                    <a className="navbar_lin1__bGONE" href="/">HOME</a>
                                    <a className="navbar_lin1__bGONE" href="/Teams">TEAMS</a>
                                    <a aria-current="page" className="navbar_lin1__bGONE active" href="/Sponsors">SPONSORS</a>
                                    <a id="navbar_red1__MWKWk" className="navbar_lin1__bGONE" href="/">BUY TICKETS</a>
                                    <a className="navbar_lin1__bGONE" href="/ContactUs">CONTACT US</a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="innermore">
                    <div className="navbar_right__5z6Ih">
                        <a className="navbar_lin__yrOtl" href="/">HOME</a>
                        <a className="navbar_lin__yrOtl" href="/Teams">TEAMS</a>
                        <a className="navbar_lin__yrOtl" href="/Sponsors">SPONSORS</a>
                        <a id="navbar_red__gXnY4" className="navbar_lin__yrOtl" href="/BuyTickets">BUY TICKETS</a>
                        <a className="navbar_lin__yrOtl" style={{ color: '#eb0028' }} href="/ContactUs">CONTACT US</a>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Navbar;
