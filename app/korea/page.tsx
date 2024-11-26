"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { platforms } from "@/constant/korea";
import { getYesterday } from "@/utils/date";
import { FaYoutube } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { useYouTubePlayer } from "@/context/YouTubePlayerContext";
import { CgPlayButtonO } from "react-icons/cg";
import clsx from "clsx";

interface RankingData {
  ranking: number;
  youtubeID: string;
  image: string;
  title: string;
  artist: string;
}

export default function KoreaPage() {
  const [platform, setPlatform] = useState<string>("apple");
  const [date, setDate] = useState<string>(() => getYesterday());
  const [rankingData, setRankingData] = useState<RankingData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const { setVideoId, videoId } = useYouTubePlayer();

  // 플랫폼 상태를 Local Storage에서 가져오기
  useEffect(() => {
    const savedPlatform = localStorage.getItem("selectedPlatform");
    setPlatform(savedPlatform || "apple"); // 초기값 설정
  }, []);

  // 플랫폼 변경 시 Local Storage에 저장
  const handlePlatformClick = (selectedPlatform: string) => {
    setPlatform(selectedPlatform);
    localStorage.setItem("selectedPlatform", selectedPlatform); // 즉시 저장
  };

  const fetchRankingData = useCallback(async () => {
    if (!platform || !date) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://websseu.github.io/pythonMusic/korea/${platform}/${platform}Top100_${date}.json`
      );
      if (!response.ok) throw new Error("데이터를 가져오지 못했습니다.!");
      const data = await response.json();
      setRankingData(data);
    } catch (err) {
      console.error("데이터 에러 발생", err);
      setRankingData([]);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [platform, date]);

  useEffect(() => {
    fetchRankingData();
  }, [fetchRankingData]);

  const selectedPlatformLabel = platforms.find(
    (item) => item.id === platform
  )?.id;

  const openDatePicker = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const handleMusicItemClick = (youtubeID: string) => {
    setVideoId(youtubeID);
  };

  return (
    <section id="koreaPage">
      {/* 플랫폼 리스트 */}
      <div className="music__platforms">
        {platforms.map((item) => (
          <span
            key={item.id}
            data-platform={item.id}
            onClick={() => handlePlatformClick(item.id)}
            className={clsx(
              "music__platform",
              platform === item.id && "bg-blue-100 border-blue-700"
            )}
          >
            <Image
              src={item.icon}
              alt={item.id}
              width={20}
              height={20}
              className="rounded-md"
            />
            <span className="hidden md:block">{item.label}</span>
          </span>
        ))}
      </div>

      {/* 뮤직 리스트 */}
      <div className="music__list">
        <div className="music__title">
          <h2>
            {selectedPlatformLabel
              ? `${selectedPlatformLabel} . ${date} . TOP 100`
              : "TOP 100"}
          </h2>
          <div className="relative inline-block">
            <button
              onClick={openDatePicker}
              className="p-2 rounded-md hover:bg-gray-300 cursor-pointer"
            >
              <IoCalendarOutline size={18} className="text-gray-900" />
            </button>
            <input
              type="date"
              ref={dateInputRef}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="absolute top-0 left-0 w-full h-full hidden"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="music__ranking">
          {isLoading ? (
            <p className="text-center text-gray-600 border-t border-black py-60">
              로딩 중...
            </p>
          ) : error ? (
            <p className="text-center text-red-600 border-t border-black py-60">
              에러 발생! 관리자에게 문의하세요! : {error}
            </p>
          ) : rankingData.length > 0 ? (
            <ul>
              {rankingData.map((item) => (
                <li
                  key={item.ranking}
                  onClick={() => handleMusicItemClick(item.youtubeID)}
                  className={`group ${
                    item.youtubeID
                      ? "cursor-pointer hover:bg-slate-200"
                      : "pointer-events-none"
                  } ${
                    videoId === item.youtubeID
                      ? "bg-slate-200 font-bold text-gray-800"
                      : ""
                  }`}
                >
                  <span className="w-6 md:w-10 text-sm text-[#6E6E6E] flex items-center justify-center poppins">
                    {videoId === item.youtubeID ? (
                      <CgPlayButtonO size={20} />
                    ) : (
                      item.ranking
                    )}
                  </span>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={40}
                    height={40}
                    className="rounded-md"
                    priority
                  />
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-gray-700">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#6E6E6E]">{item.artist}</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <span
                      className={`music__icon ${
                        item.youtubeID ? "cursor-pointer" : "cursor-not-allowed"
                      }`}
                    >
                      <FaYoutube
                        size={14}
                        className={`${
                          item.youtubeID ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-red-600 border-t border-black py-60">
              해당 날짜는 데이터가 없습니다.
              <br />
              2025년 01월 01부터 데이터를 제공합니다.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
