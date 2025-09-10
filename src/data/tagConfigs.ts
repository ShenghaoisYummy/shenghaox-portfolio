export interface ImageModalConfig {
  isOpen: boolean;
  title: string;
  images: string[];
  danmakuText: string;
  enableDanmaku: boolean;
  imageWidth: number;
  imageHeight: number;
}

export interface MusicModalConfig {
  isOpen: boolean;
  title: string;
  musicUrl: string;
  cover: string;
  author: string;
  danmakuText: string;
  enableDanmaku: boolean;
}

export interface VideoModalConfig {
  isOpen: boolean;
  videoUrl: string;
  danmakuText: string;
  enableDanmaku: boolean;
}

export interface TagConfig {
  type: "image" | "music" | "video" | "link";
  config:
    | ImageModalConfig
    | MusicModalConfig
    | VideoModalConfig
    | { url: string };
}

export const tagConfigs: Record<string, TagConfig> = {
  cooking: {
    type: "image",
    config: {
      isOpen: true,
      title: "Cooking",
      images: [],
      danmakuText: "Delicious",
      enableDanmaku: true,
      imageWidth: 500,
      imageHeight: 500,
    },
  },
  photography: {
    type: "image",
    config: {
      isOpen: true,
      title: "Photography Works",
      images: [],
      danmakuText: "Beautiful",
      enableDanmaku: true,
      imageWidth: 800,
      imageHeight: 800,
    },
  },
  food: {
    type: "image",
    config: {
      isOpen: true,
      title: "Food",
      images: [],
      danmakuText: "Delicious",
      enableDanmaku: true,
      imageWidth: 500,
      imageHeight: 500,
    },
  },
  wuha: {
    type: "music",
    config: {
      isOpen: true,
      title: "wuha",
      musicUrl: "",
      cover: "/images/wuha.jpg",
      author: "Deng Chao & Chen He & Lu Han & Fan Zhiyi & Gem & Wang Mian",
      danmakuText: "Great song",
      enableDanmaku: true,
    },
  },
  "song-in-the-sky": {
    type: "music",
    config: {
      isOpen: true,
      title: "Song in the Sky",
      musicUrl: "",
      cover: "/images/tkzdg.jpg",
      author: "Cui Yiqiao",
      danmakuText: "Great song",
      enableDanmaku: true,
    },
  },
  flowers: {
    type: "music",
    config: {
      isOpen: true,
      title: "Flowers",
      musicUrl: "",
      cover: "/images/xh.jpg",
      author: "Huichundan Band",
      danmakuText: "Great song",
      enableDanmaku: true,
    },
  },
  "crayon-shin-chan": {
    type: "video",
    config: {
      isOpen: true,
      videoUrl: "",
      danmakuText: "Crayon Shin-chan",
      enableDanmaku: true,
    },
  },
  "cang-yuan-tu": {
    type: "video",
    config: {
      isOpen: true,
      videoUrl: "",
      danmakuText: "Cang Yuan Tu",
      enableDanmaku: true,
    },
  },
  "pillow-sword-song": {
    type: "video",
    config: {
      isOpen: true,
      videoUrl: "",
      danmakuText: "Pillow Sword Song",
      enableDanmaku: true,
    },
  },
  "blades-of-the-guardians": {
    type: "video",
    config: {
      isOpen: true,
      videoUrl: "",
      danmakuText: "Blades of the Guardians",
      enableDanmaku: true,
    },
  },
  "league-of-legends-mobile": {
    type: "video",
    config: {
      isOpen: true,
      videoUrl: "",
      danmakuText: "Pentakill! I'm awesome!!",
      enableDanmaku: true,
    },
  },
  "the-outcast": {
    type: "video",
    config: {
      isOpen: true,
      videoUrl: "",
      danmakuText: "Classy",
      enableDanmaku: true,
    },
  },
  "the-outcast-tiangang-legend": {
    type: "video",
    config: {
      isOpen: true,
      videoUrl: "4",
      danmakuText: "Welcome General",
      enableDanmaku: true,
    },
  },
  "demon-slayer": {
    type: "video",
    config: {
      isOpen: true,
      videoUrl: "",
      danmakuText: "Demon Slayer",
      enableDanmaku: true,
    },
  },
  music: {
    type: "link",
    config: {
      url: "https://y.qq.com/",
    },
  },
};
