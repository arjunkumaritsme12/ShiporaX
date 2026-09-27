import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const CREATE_RELEASE = gql`
  mutation CreateRelease($name: String!, $date: String!, $additionalInfo: String) {
    createRelease(name: $name, date: $date, additionalInfo: $additionalInfo) {
      id
      name
      date
      status
    }
  }
`;

export default function CreateRelease({ onCreated }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [info, setInfo] = useState('');

  const [createRelease, { loading }] = useMutation(CREATE_RELEASE, {
    onCompleted: () => {
      setName('');
      setDate('');
      setInfo('');
      if (onCreated) onCreated();
    },
    refetchQueries: ['GetReleases']
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date) return;
    
    const isoDate = new Date(date).toISOString();
    
    createRelease({ variables: { name, date: isoDate, additionalInfo: info } });
  };

  return (
    <div className="card">
      <h3>Create New Release</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Release Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Additional Info</label>
          <textarea value={info} onChange={e => setInfo(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Release'}
        </button>
      </form>
    </div>
  );
}
