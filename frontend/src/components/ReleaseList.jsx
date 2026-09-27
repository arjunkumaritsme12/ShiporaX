import React from 'react';
import { gql, useQuery } from '@apollo/client';
import ReleaseItem from './ReleaseItem';

const GET_RELEASES = gql`
  query GetReleases {
    releases {
      id
      name
      date
      additionalInfo
      steps
      status
    }
    stepLabels
  }
`;

export default function ReleaseList() {
  const { loading, error, data } = useQuery(GET_RELEASES);

  if (loading) return <p>Loading releases...</p>;
  if (error) return <p>Error loading releases: {error.message}</p>;

  return (
    <div>
      {data.releases.map(release => (
        <ReleaseItem 
          key={release.id} 
          release={release} 
          stepLabels={data.stepLabels} 
        />
      ))}
    </div>
  );
}
