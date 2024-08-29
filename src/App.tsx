import React, { useEffect, useState } from 'react';
import axios from 'axios'; // API 연결 시 사용 예정
import icon_back from './assets/icon_back.svg';

interface VideoSummary {
  id: string;
  title: string;
  date: string;
  summary: string;
  contents: Array<{ screenshot: string; subtitle: string; description: string }>;
}

const App: React.FC = () => {
  const [video, setVideo] = useState<VideoSummary | null>({
    // 유튜브 영상 테스트 프로퍼티, API 연결 시 제거
    id: 'mbxWk7kq4IM',  // 유튜브 링크 맨 뒤에 있는 ID
    title: 'Test Video',
    date: '2024-08-25',
    summary: 'This is a test summary.',
    contents: [
      {
        screenshot: 'https://via.placeholder.com/150', // API 필요
        subtitle: '소제목1',
        description: 'This is the first section description.',
      },
      {
        screenshot: 'https://via.placeholder.com/150', // API 필요
        subtitle: '소제목2',
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
    <div className="max-w-md mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <button onClick={() => window.history.back()} className="text-2xl bg-none border-none cursor-pointer">
          <img src={icon_back} alt="Back" />
        </button>
        <h1 className="text-lg font-bold">Video Summary</h1>
      </header>
      <hr className="border-0 h-px bg-gray-300 mb-5" />

      <div className="mb-5">
        <iframe
          width="100%"
          height="180"
          src={`https://www.youtube.com/embed/${video.id}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="mb-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{video.title}</h2>
          <span className="text-sm text-gray-500">spot date: {video.date}</span>
        </div>
        <p className="text-sm text-gray-500 mb-3">{video.summary}</p>
      </div>

      <div className="mb-5">
        <h3 className="text-md font-semibold mb-3">목차</h3>
        <ul className="list-decimal pl-4 text-sm">
          {video.contents.map((content, index) => (
            <li key={index} className="mb-1">
              <a href={`#section-${index + 1}`} className="text-blue-500 hover:underline">
                {content.subtitle}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {video.contents.map((content, index) => (
          <div key={index} id={`section-${index + 1}`} className="mb-10">
            <img src={content.screenshot} alt={content.subtitle} className="w-full h-auto mb-3" />
            <h3 className="text-lg font-semibold">{content.subtitle}</h3>
            <p className="text-sm text-gray-700">{content.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
