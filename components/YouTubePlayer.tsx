"use client";

import React from "react";
import { useYouTubePlayer } from "../context/YouTubePlayerContext";
import { SlClose } from "react-icons/sl";

const YouTubePlayer: React.FC = () => {
  const { videoId, setVideoId } = useYouTubePlayer();

  if (!videoId) return null;

  return (
    <div className="fixed z-50 bottom-[54px] right-[10px] md:bottom-4 md:right-4 md:w-[400px] md:h-[225px] w-[300px] h-[169px] bg-black rounded-md overflow-hidden shadow-lg group">
      <button
        onClick={() => setVideoId(null)}
        className="absolute top-2 right-2 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <SlClose size={20} />
      </button>
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubePlayer;
