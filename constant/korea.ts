export type MusicPlatform = {
  id: string;
  label: string;
  icon: string;
  site: string;
};

export const platforms: MusicPlatform[] = [
  {
    id: "apple",
    label: "애플 뮤직",
    icon: "/logo/apple.png",
    site: "https://music.apple.com/kr/playlist/%EC%98%A4%EB%8A%98%EC%9D%98-top-100-%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD/pl.d3d10c32fbc540b38e266367dc8cb00c",
  },
  {
    id: "melon",
    label: "멜론",
    icon: "/logo/melon.png",
    site: "https://www.melon.com/chart/index.htm",
  },
  {
    id: "genie",
    label: "지니",
    icon: "/logo/genie.png",
    site: "https://www.genie.co.kr/chart/top200?ditc=D&ymd=20241105&hh=10&rtm=Y&pg=1",
  },
  {
    id: "bugs",
    label: "벅스",
    icon: "/logo/bugs.png",
    site: "https://music.bugs.co.kr/chart",
  },
  {
    id: "flo",
    label: "플로",
    icon: "/logo/flo.png",
    site: "https://www.music-flo.com/browse",
  },
  {
    id: "vibe",
    label: "바이브",
    icon: "/logo/vibe.png",
    site: "https://vibe.naver.com/chart/total",
  },
];
