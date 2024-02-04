import React, { useState, useEffect } from 'react';
import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNotification } from '../assets/NotificationContext';

const ReportsTable = () => {
  const { addNotification } = useNotification();
  const [groupReport, setGroupReport] = useState([]);

  useEffect(() => {
    const fetchGroupReport = async () => {
      try {
        const groupReportCollection = collection(db, 'reports');
        const groupReportSnapshot = await getDocs(groupReportCollection);
        const groupReportData = [];

        groupReportSnapshot.forEach((doc) => {
          groupReportData.push({ id: doc.id, ...doc.data() });
        });

        setGroupReport(groupReportData);
      } catch (error) {
        console.error('Error fetching group reports:', error);
      }
    };

    fetchGroupReport();
  }, []);

  const handleDelete = async (postId, reportsId) => {
    try {
      // Delete post from 'posts' collection
      await deleteDoc(doc(db, 'posts', postId));

      await deleteDoc(doc(db, 'reports', reportsId));

      // Add a notification
      addNotification({
        message: `The post with ID ${postId} and report in group ${reportsId} have been deleted!`,
        type: 'success',
      });

      // Fetch updated group reports
      const updatedGroupReport = groupReport.filter((reports) => reports.id !== postId);
      setGroupReport(updatedGroupReport);
    } catch (error) {
      console.error('Error deleting post and report:', error);
    }
  };

  return (
    <div>
      <h2>Group Reports</h2>
      {groupReport.length > 0 ? (
        <table className='ksksk'>
          <thead>
            <tr>
              <th>Report ID </th>
              <th>Post ID</th>
              <th>Group</th>
              <th>Content</th>
              <th>User Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {groupReport.map((reports ,posts) => (
              <tr key={reports.id}>
                <td>{reports.id}</td>
                <td>{reports.postId}</td>
                <td>{reports.group}</td>
                <td>{reports.content}</td>
                <td>{reports.user}</td>
                <td>
                  <button onClick={() => handleDelete(reports.id, reports.postId, reports.group, reports.content, reports.user, posts.id, posts.content, posts.group, posts.user, reports.postId, reports.group)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No group reports available.</p>
      )}
    </div>
  );
};

export default ReportsTable;
