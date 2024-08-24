import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'; //api 연결시 사용 예정
 
interface VideoSummary {
  id: string;
  title: string;
  date: string;
  summary: string;
  contents: Array<{ screenshot: string; subtitle: string; description: string }>;
}

const App: React.FC = () => {
  const [video, setVideo] = useState<VideoSummary | null>({
    // 유튜브 영상 테스트 프로퍼티, api 연결시 제거
    id: 'mbxWk7kq4IM', 
    title: 'Test Video',
    date: '2024-08-25',
    summary: 'This is a test summary.',
    contents: [
      {
        screenshot: 'https://via.placeholder.com/150',
        subtitle: 'Section 1',
        description: 'This is the first section description.',
      },
      {
        screenshot: 'https://via.placeholder.com/150',
        subtitle: 'Section 2',
        description: 'This is the second section description.',
      },
    ],
  });

  useEffect(() => {
    // API 호출하여 데이터 가져오기
    axios.get<VideoSummary>('/api/video-summary')
      .then(response => {
        setVideo(response.data);
      })
      .catch(error => {
        console.error('Error fetching the video summary:', error);
      });
  }, []);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <header className="header">
        <button className="back-button" onClick={() => window.history.back()}> {/*안드로이드 웹뷰의 경우 이전으로 되돌아가 가기를 다시 구현해야 함*/}
          &lt; {/* <돌아가기 표시. svg로 바꿀 예정 */}
        </button>
        <h1 className="header-title">Video Summary</h1>
      </header>
      <hr className="divider" />
      <div className="video-embed">
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="video-info">
        <h1>{video.title}</h1>
        <div className="video-meta">
          <span>{video.date}</span>
          <span className="bookmark">🔖</span>
        </div>
        <p className="summary">{video.summary}</p>
      </div>
      <div className="table-of-contents">
        <h2>Table of Contents</h2>
        <ul>
          {video.contents.map((content, index) => (
            <li key={index}>
              <a href={`#section-${index + 1}`}>
                {content.subtitle}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="video-sections">
        {video.contents.map((content, index) => (
          <div key={index} id={`section-${index + 1}`} className="section">
            <img src={content.screenshot} alt={content.subtitle} />
            <h3>{content.subtitle}</h3>
            <p>{content.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
