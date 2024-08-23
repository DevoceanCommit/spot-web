import React, { useEffect, useState } from 'react';
import { css } from '@linaria/core';
import VideoDetail from './components/VideoDetail';

const App: React.FC = () => {
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    // 백엔드 API 호출 예시
    fetch('/api/video-detail')
      .then((res) => res.json())
      .then((data) => setVideoData(data))
      .catch((error) => console.error('Error fetching video data:', error));
  }, []);

  return (
    <div className={container}>
      {videoData ? (
        <VideoDetail {...videoData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;

const container = css`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;
