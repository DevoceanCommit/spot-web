import React from 'react';
import { css } from '@linaria/core';

type VideoDetailProps = {
  videoUrl: string;
  title: string;
  date: string;
  summary: string;
  tableOfContents: string[];
  sections: Array<{
    image: string;
    subheading: string;
    content: string;
  }>;
};

const VideoDetail: React.FC<VideoDetailProps> = ({
  videoUrl,
  title,
  date,
  summary,
  tableOfContents,
  sections,
}) => {
  return (
    <div className={detailContainer}>
      <div className={videoContainer}>
        <iframe
          className={video}
          src={videoUrl}
          title={title}
          allowFullScreen
        />
      </div>
      <h1 className={titleStyle}>{title}</h1>
      <p className={dateStyle}>{date}</p>
      <p className={summaryStyle}>{summary}</p>
      <div className={tocContainer}>
        <h2>Table of Contents</h2>
        <ul>
          {tableOfContents.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div className={sectionsContainer}>
        {sections.map((section, index) => (
          <div key={index} className={sectionContainer}>
            <img src={section.image} alt={`Section ${index + 1}`} className={sectionImage} />
            <h3 className={subheading}>{section.subheading}</h3>
            <p className={content}>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoDetail;

const detailContainer = css`
  display: flex;
  flex-direction: column;
`;

const videoContainer = css`
  width: 100%;
  height: 315px;
  margin-bottom: 16px;
`;

const video = css`
  width: 100%;
  height: 100%;
  border: none;
`;

const titleStyle = css`
  font-size: 24px;
  font-weight: bold;
`;

const dateStyle = css`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
`;

const summaryStyle = css`
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 24px;
`;

const tocContainer = css`
  margin-bottom: 32px;
  ul {
    list-style-type: decimal;
    padding-left: 20px;
  }
  li {
    margin-bottom: 8px;
    font-size: 16px;
  }
`;

const sectionsContainer = css`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const sectionContainer = css`
  display: flex;
  flex-direction: column;
`;

const sectionImage = css`
  width: 100%;
  height: auto;
  margin-bottom: 16px;
`;

const subheading = css`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const content = css`
  font-size: 16px;
  line-height: 1.5;
`;
