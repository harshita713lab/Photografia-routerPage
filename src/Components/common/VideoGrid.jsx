// src/components/common/VideoGrid.jsx
import React, { useRef, useEffect } from 'react';
import styles from '../../Styles/common/VideoGrid.module.css';  // ← PATH FIX

const VideoCard = ({ src, poster, title, aspectRatio = '16/9', isFullScreen = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay prevented:', e));
    }
  }, []);

  return (
    <div className={`${styles.videoCard} ${isFullScreen ? styles.fullScreenVideoCard : ''}`}>
      <video
        ref={videoRef}
        className={`${styles.video} ${isFullScreen ? styles.fullScreenVideo : ''}`}
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
      />
      {title && (
        <div className={styles.videoTitle}>
          <span>{title}</span>
        </div>
      )}
    </div>
  );
};

const VideoGrid = ({ 
  videos = [], 
  columns = 2, 
  gap = 20,
  singleVideoSize = 'fullscreen',
  className = '',
  fullWidth = true
}) => {
  const videoCount = videos.length;

  if (videoCount === 1) {
    const sizeClass = {
      fullscreen: styles.singleFullscreen,
      large: styles.singleLarge,
      medium: styles.singleMedium,
      small: styles.singleSmall
    }[singleVideoSize];

    return (
      <div className={`${styles.singleVideoContainer} ${sizeClass} ${className} ${fullWidth ? styles.fullWidthContainer : ''}`}>
        <VideoCard 
          src={videos[0].src} 
          poster={videos[0].poster} 
          title={videos[0].title}
          aspectRatio={videos[0].aspectRatio || '16/9'}
          isFullScreen={singleVideoSize === 'fullscreen'}
        />
      </div>
    );
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${Math.min(columns, videoCount)}, 1fr)`,
    gap: `${gap}px`
  };

  return (
    <div className={`${styles.videoGridContainer} ${className} ${fullWidth ? styles.fullWidthContainer : ''}`}>
      <div style={gridStyle} className={styles.grid}>
        {videos.map((video, index) => (
          <VideoCard 
            key={index}
            src={video.src} 
            poster={video.poster} 
            title={video.title}
            aspectRatio={video.aspectRatio || '16/9'}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;