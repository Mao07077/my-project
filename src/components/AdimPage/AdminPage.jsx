// AdminPage.js
import React, { useState, useEffect } from 'react';
import { Header } from '../assets/header';
import './AdminPage.css';
import { auth } from '../../config/firebase';
import GroupRequestTable from './GroupRequestTable'; // Import the GroupRequestTable component
import UsersAccountTable from './UsersAccountTable';
import GroupTable from './GroupTable'; // Import the new GroupTable component
import ReportTable from './ReportTable';



// Define the AdminPage component
const AdminPage = () => {
  // State to manage the content based on the clicked button
  const [content, setContent] = useState(<UsersAccountTable />); // Set default content here
  const [profilePic, setProfilePic] = useState(null);

  // Function to fetch all user emails from Firebase
  const handleButtonClick = async (buttonNumber) => {
    // Update content based on the clicked button
    switch (buttonNumber) {
      case 1:
        setContent(<UsersAccountTable />);
        break;
      case 2:
        setContent(<ReportTable/>);
        break;
      case 3:
        setContent(<GroupRequestTable />);
        break;
      case 4:
        setContent(<GroupTable />);
        break;
      // No default case needed
    }
  };

  useEffect(() => {
    // Get the current user's ID
    const userId = auth.currentUser?.uid;

    // Retrieve the user's profile picture from local storage
    const storedProfilePic = localStorage.getItem(`profilePic_${userId}`);
    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }

    // Clean up the listener when the component unmounts
    return () => {
      // Cleanup code here (if needed)
    };
  }, [auth.currentUser?.uid]);

  // Return the JSX structure of the component
  return (
    <div className='bg'>
      {/* Header component */}
      <Header />

      {/* Content section */}
      <div className='greeninfo'>
        {profilePic ? (
          <img className='profiley' src={profilePic} alt='Profile' />
        ) : (
          <img className='defaultProfilePic' src='default-profile-pic.jpg' alt='Default Profile' />
        )}
        <div className='buttons'>
          <button className='pindot' onClick={() => handleButtonClick(1)}>Users Account</button>
          <button className='pindot' onClick={() => handleButtonClick(2)}>Reports</button>
          <button className='pindot' onClick={() => handleButtonClick(3)}>Group Requests</button>
          <button className='pindot' onClick={() => handleButtonClick(4)}>Groups</button>
        </div>
      </div>
      <div className='contents'>
        {content}
      </div>
    </div>
  );
};

// Export the AdminPage component
export { AdminPage };
