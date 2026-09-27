import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const TOGGLE_STEP = gql`
  mutation ToggleStep($releaseId: Int!, $stepIndex: Int!) {
    toggleStep(releaseId: $releaseId, stepIndex: $stepIndex) {
      id
      steps
      status
    }
  }
`;

const UPDATE_INFO = gql`
  mutation UpdateInfo($releaseId: Int!, $info: String!) {
    updateAdditionalInfo(releaseId: $releaseId, info: $info) {
      id
      additionalInfo
    }
  }
`;

const DELETE_RELEASE = gql`
  mutation DeleteRelease($id: Int!) {
    deleteRelease(id: $id)
  }
`;

export default function ReleaseItem({ release, stepLabels }) {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoDraft, setInfoDraft] = useState(release.additionalInfo || '');

  const [toggleStep] = useMutation(TOGGLE_STEP);
  const [updateInfo] = useMutation(UPDATE_INFO);
  const [deleteRelease] = useMutation(DELETE_RELEASE, {
    refetchQueries: ['GetReleases']
  });

  const handleToggle = (index) => {
    toggleStep({ variables: { releaseId: release.id, stepIndex: index } });
  };

  const handleSaveInfo = () => {
    updateInfo({ variables: { releaseId: release.id, info: infoDraft } });
    setIsEditingInfo(false);
  };

  return (
    <div className="card">
      <div className="release-header">
        <div>
          <h2>{release.name}</h2>
          <p>{new Date(release.date).toLocaleString()}</p>
        </div>
        <div>
          <span className={`badge ${release.status}`}>{release.status}</span>
          <button className="danger" onClick={() => deleteRelease({ variables: { id: release.id } })} style={{ marginLeft: '1rem' }}>Delete</button>
        </div>
      </div>
      
      <div>
        <strong>Info: </strong>
        {isEditingInfo ? (
          <div>
            <textarea value={infoDraft} onChange={e => setInfoDraft(e.target.value)} />
            <button onClick={handleSaveInfo}>Save</button>
            <button onClick={() => setIsEditingInfo(false)}>Cancel</button>
          </div>
        ) : (
          <span>
            {release.additionalInfo || 'No additional info '}
            <button onClick={() => setIsEditingInfo(true)}>Edit</button>
          </span>
        )}
      </div>

      <div className="steps-grid">
        {stepLabels.map((label, i) => (
          <label key={i} className="step-item">
            <input 
              type="checkbox" 
              checked={release.steps[i]} 
              onChange={() => handleToggle(i)} 
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}
