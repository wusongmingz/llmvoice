export const useSound = () => {
  const getSoundLists = () => {
    return [
      {
        name: '音效1',
        uri: 'https://www.w3school.com.cn/i/song.mp3',
      },
      {
        name: '音效2',
        uri: 'http://music.163.com/song/media/outer/url?id=123456.mp3',
      },
      {
        name: '音效3',
        uri: 'http://music.163.com/song/media/outer/url?id=123455.mp3',
      },
      {
        name: '音效3',
        uri: 'http://music.163.com/song/media/outer/url?id=123455.mp3',
      },
    ];
  };
  const getListoryLists = () => {
    return [
      {
        desc: '描述阿八八八八八八八八八八八阿阿八八八八八八八八阿阿八八八八八八八八八八八八阿阿八八八八八八八八八八八八阿阿八八八八八八八八八八八八阿阿八八八八八八八八八',
        create_time: '2024/10/21 15：03',
        array: [
          {
            create_time: '2024/10/21 15：03',
            desc: '描述阿八八八八八八八八八八八阿阿八八八八八八八八八八八八八八八八八八八八八阿阿八八八八八',
            uri: 'https://www.w3school.com.cn/i/song.mp3',
            order: '1',
          },
          {
            create_time: '2024/10/21 15：04',
            desc: '描述阿八八八八八八八八八八八阿阿八八八八八',
            uri: 'https://www.w3school.com.cn/i/song.mp3',
            order: '2',
          },
          {
            create_time: '2024/10/21 15：05',
            desc: '描述阿八八八八八八八八八八八阿阿八八八八八',
            uri: 'https://www.w3school.com.cn/i/song.mp3',
            order: '3',
          },
          {
            create_time: '2024/10/21 15：06',
            desc: '描述阿八八八八八八八八八八八阿阿八八八八八',
            uri: 'https://www.w3school.com.cn/i/song.mp3',
            order: '4',
          },
        ],
      },
      {
        desc: '描述阿八八八八八八八八八八八阿阿八八八八八',

        array: [
          {
            create_time: '2024/10/21 15：03',
            uri: 'https://www.w3school.com.cn/i/song.mp3',
            order: '1',
          },
          {
            create_time: '2024/10/21 15：04',
            uri: 'https://www.w3school.com.cn/i/song.mp3',
            order: '2',
          },
          {
            create_time: '2024/10/21 15：05',
            uri: 'https://www.w3school.com.cn/i/song.mp3',
            order: '3',
          },
          {
            create_time: '2024/10/21 15：06',
            uri: 'https://www.w3school.com.cn/i/song.mp3',
            order: '4',
          },
        ],
      },
    ];
  };

  return {
    getSoundLists,
    getListoryLists,
  };
};
