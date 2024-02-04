import React, { useState, useEffect } from 'react';
import { Header } from '../assets/header2.0';
import { Weather } from '../assets/Weather';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs,} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import './UserPage.css';

const UserPage = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [showComments] = useState({});

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        if (auth.currentUser) {
          const userGroupsRef = collection(db, 'Groups');
          const userGroupsQuery = query(userGroupsRef, where('members', 'array-contains', auth.currentUser.email));
          const userGroupsSnapshot = await getDocs(userGroupsQuery);
          const userGroupsData = userGroupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUserGroups(userGroupsData);
        } else {
          console.error('User not authenticated.');
        }
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const postsData = await Promise.all(
          userGroups.map(async (group) => {
            const postsRef = collection(db, 'posts');
            const postsQuery = query(postsRef, where('group', '==', group.id));
            const postsSnapshot = await getDocs(postsQuery);
            const groupPostsData = await Promise.all(postsSnapshot.docs.map(async (postDoc) => {
              const postData = { id: postDoc.id, ...postDoc.data(), groupName: group.groupName }; // Include groupName
              
              // Fetch comments for each post
              const commentsRef = collection(db, 'comments');
              const commentsQuery = query(commentsRef, where('post', '==', postData.id));
              const commentsSnapshot = await getDocs(commentsQuery);
              postData.comments = commentsSnapshot.docs.map(commentDoc => commentDoc.data());

              return postData;
            }));
            return groupPostsData;
          })
        );

        setUserPosts(postsData.flat());
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserGroups();
    fetchUserPosts();
  }, [userGroups]);

 

  return (
    <div className='bg'>
      <Header />
      <Weather/>
      <div className='FRRRR'>
        
        {userPosts.map((post) => (
          <div key={post.id} className='user-post-container'>
            <div className='post-container'>
              <p>{post.content}</p>
              <h4>Posted by: {post.user}</h4>
              <Link to={`/groups/${post.group}`}><h5>Group:</h5>{post.groupName}</Link> {/* Updated this line */}
            
              {/* Display comments for each post */}
              <div className='comments-section'>
                <h3>Comments</h3>
                {post.comments && post.comments.map((comment, index) => (
                  <div key={index} className='comment'>
                    <p><strong>{comment.user}:</strong> {comment.content}</p>
                  </div>
                ))}
              </div>
              {showComments[post.id] && (
                <div className='additional-comments'>
                  {/* Render additional comments here */}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { UserPage };