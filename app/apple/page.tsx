"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { appleMusicRankings } from "@/constant/apple";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { IoCalendarOutline } from "react-icons/io5";
import { getYesterday } from "@/utils/date";
import { FaYoutube } from "react-icons/fa";
import { useYouTubePlayer } from "@/context/YouTubePlayerContext";

export default function ApplePage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("global");
  const [selectedDate, setSelectedDate] = useState<string>(getYesterday());
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [musicData, setMusicData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setVideoId, videoId } = useYouTubePlayer();

  // 국가 선택 핸들러
  const handleCountryClick = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  // 선택된 국가 데이터 찾기
  const selectedCountryData = appleMusicRankings.find(
    (country) => country.name === selectedCountry
  );

  // 달력 토글 핸들러
  const toggleCalendar = () => {
    setIsCalendarOpen((prev) => !prev);
  };

  // 데이터 가져오기
  useEffect(() => {
    const fetchMusicData = async () => {
      if (!selectedCountry || !selectedDate) return;

      const url = `https://websseu.github.io/pythonMusic/apple/${selectedCountry}/${selectedCountry}Top100_${selectedDate}.json`;

      console.log("API 요청 URL:", url); // 디버깅용

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error("데이터를 가져오는 중 오류가 발생했습니다.");
        const data = await response.json();
        setMusicData(data);
      } catch (err) {
        console.error(err);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
        setMusicData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusicData();
  }, [selectedCountry, selectedDate]);

  const handleMusicItemClick = (youtubeID: string) => {
    setVideoId(youtubeID);
  };

  return (
    <section id="ApplePage">
      <div className="appleCountry">
        {appleMusicRankings.map((country) => (
          <span
            key={country.name}
            onClick={() => handleCountryClick(country.name)}
            className={clsx(
              "appleCountry__icon",
              selectedCountry === country.name
                ? "bg-blue-200 border-blue-500"
                : "hover:bg-gray-200 border-gray-300"
            )}
            aria-selected={selectedCountry === country.name}
          >
            {country.icon}
          </span>
        ))}
      </div>
      <div className="music__list">
        <div className="apple__title">
          <h2>
            {selectedCountryData
              ? `${selectedCountryData.nameKorean} 음악 Top 100 : `
              : "Top 100"}
          </h2>
          <p>{selectedDate}</p>
          <div>
            <button
              onClick={toggleCalendar}
              className="p-2 rounded-md border hover:bg-gray-200"
            >
              <IoCalendarOutline size={20} />
            </button>

            {/* 달력 표시 */}
            {isCalendarOpen && (
              <div className="absolute z-50 top-[26px] bg-[#f8f7f1] border p-3 rounded-md mt-4">
                <DayPicker
                  mode="single"
                  selected={new Date(selectedDate)}
                  onSelect={(date) => {
                    if (date) setSelectedDate(date.toISOString().split("T")[0]); // YYYY-MM-DD 형식으로 변환
                    setIsCalendarOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="apple__list">
          {isLoading ? (
            <p>로딩 중...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : musicData.length > 0 ? (
            <ul>
              {musicData.map((item, index) => (
                <li
                  key={index}
                  className="p-2 border-b relative cursor-pointer hover:bg-blue-50"
                  onClick={() => handleMusicItemClick(item.youtubeID)}
                >
                  <div className="flex items-center">
                    <span className="w-7 text-center text-xs mr-3">
                      {item.ranking}
                    </span>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded-md mr-4"
                    />
                    <div>
                      <p className="font-bold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.artist}</p>
                    </div>
                  </div>
                  <div
                    className={clsx(
                      "apple__icon",
                      item.youtubeID ? "text-red-500" : "text-gray-400"
                    )}
                  >
                    <FaYoutube />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>선택된 날짜에 데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}
