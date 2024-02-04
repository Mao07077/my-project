import React, { useState, useEffect } from 'react';
import { Header } from '../assets/header2.0';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import './yourgroup.css';

const Password = () => {
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        // Check if currentUser is available
        if (auth.currentUser) {
          // Fetch groups where the user is a member
          const userGroupsRef = collection(db, 'Groups');
          const userGroupsQuery = query(userGroupsRef, where('members', 'array-contains', auth.currentUser.email));
          const userGroupsSnapshot = await getDocs(userGroupsQuery);
          const userGroupsData = userGroupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUserGroups(userGroupsData);
        } else {
          console.error('User not authenticated.'); // Log an error or handle this case as needed
        }
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    // Call the function to fetch user groups
    fetchUserGroups();
  }, []);

  return (
    <div className='bg'>
      <Header />
      <div className='FRY'>
        <div className="GroupList">Your Group List:</div>
        <div className="center-table">
          <table>
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userGroups.map((group) => (
                <tr key={group.id}>
                  <td>{group.groupName}</td>
                  <td>
                    <Link to={`/groups/${group.id}`}>View Group</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { Password };
