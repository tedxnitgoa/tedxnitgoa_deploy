import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    comments: "",
    newsletter: false
  });
  const history = useHistory();
  const [showThanks, setShowThanks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
  
    try {
      const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/submit-form`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setFormData({ 
          firstName: "",
          lastName: "",
          email: "",
          contactNumber: "",
          comments: "",
          newsletter: false
        });
        
        setShowThanks(true);
        setTimeout(() => {
          setShowThanks(false);
        }, 5000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred while submitting the form.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue
    });
  }

  return (
    <div className="contactUs_main__K5-vK">
      <div className="contactUs_content__GojN3">
        <div>
          <p className="contactUs_title__Kgi-W">Leave Us a Message!!</p>
          <p className="contactUs_para__kMKHs">
            
          </p>
         
    
      
    

        </div>
      
        <div class="Maps">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30806.6191706304!2d73.98994803428646!3d15.167820940042557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbe4dade7a19b97%3A0x9db46cb6ea1d0d3f!2sNIT%20Goa%20Permanent%20Campus!5e0!3m2!1sen!2sin!4v1706522628623!5m2!1sen!2sin"
        width="400" height="300" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      </div>
      <div className="contactUs_formContainer__tPtU6">
        <form name="submit-to-google-sheet" className="contactUs_form__+xwV4" onSubmit={handleSubmit}>
          <input 
            className="contactUs_formField__cPIkI" 
            type="text" 
            name="firstName" 
            placeholder="First Name*" 
            required 
            value={formData.firstName} 
            onChange={handleInputChange} 
          />
          <input 
            className="contactUs_formField__cPIkI" 
            type="text" 
            name="lastName" 
            placeholder="Last Name" 
            value={formData.lastName} 
            onChange={handleInputChange} 
          />
          <input 
            className="contactUs_formField__cPIkI" 
            type="email" 
            name="email" 
            placeholder="Email*" 
            required 
            value={formData.email} 
            onChange={handleInputChange} 
          />
          <input 
            className="contactUs_formField__cPIkI" 
            type="tel" 
            name="contactNumber" 
            placeholder="Contact Number*" 
            required 
            value={formData.contactNumber} 
            onChange={handleInputChange} 
          />
          <textarea 
            className="contactUs_comments__UC869 contactUs_formField__cPIkI" 
            name="comments" 
            placeholder="Comments" 
            cols="30" 
            rows="5" 
            value={formData.comments} 
            onChange={handleInputChange}
          ></textarea>
          <label className="contactUs_checkboxContainer__jawZS">
            <input 
              className="contactUs_checkbox__ZFnuD" 
              name="newsletter" 
              type="checkbox" 
              checked={formData.newsletter} 
              onChange={handleInputChange} 
              style={{cursor:'pointer'}}
            />
            Sign me up for the TEDxNITGOA newsletter
          </label>
          <button 
            className="contactUs_button__xUvf6" 
            type="submit" 
            disabled={isSubmitting} 
            style={{cursor: isSubmitting ? 'not-allowed' : 'pointer'}}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
            {!isSubmitting && <span className="contactUs_arrow__b6vOg"> → </span>}
          </button>
          {showThanks && <div className="Thanks"> Thank you for your response!</div>}
          {error && <div className="Error" style={{color: 'red'}}>{error}</div>}
          <p className="contactUs_privacy__+gCuK">
            This form collects your name and email address so we can follow up with your request to become a partner. We never sell, rent, or share this information with outside parties.
          </p>
          <p className="contactUs_required__K3dRw">* Indicates required fields</p>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;