/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Dashboard = (props) => {
  /* hook to keep track of user data request */
  const [userReq, setUserReq] = useState({
    loading: true,
    data: null,
    err: null,
  });

  /* perform the fetch for user data on page-load */
  useEffect(() => {
    setUserReq({ loading: true });
    fetch('/user')
      .then((res) => res.json())
      .then((data) => setUserReq({ loading: false, data }))
      .catch((err) => setUserReq({ loading: false, err }));
  }, []);

  /* conditionally display page content */
  const { loading, data, err } = userReq;

  return (
    <div>
      <h1>Welcome to my dashboard!</h1>
      <p>Your user information is: </p>
      <pre>
        {
          loading ? 'Loading...' : (
            err
              ? 'Error fetching user data. You must be testing the client-side rendering.'
              : JSON.stringify(data, null, 2)
          )
        }
      </pre>
    </div>
  );
};

ReactDOM.render(<Dashboard />, document.getElementById('main'));
