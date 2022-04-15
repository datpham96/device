import images from 'images';

export default {
  safe_web: {
    name: 'safe_web',
    code: 'safe_web',
    icon: images.icons.safe_web,
    children: {
      safe_web_sex: {
        name: 'safe_web_sex',
        code: 'safe_web_sex',
        icon: images.icons.gender,
      },
      safe_web_gamble: {
        name: 'safe_web_gamble',
        code: 'safe_web_gamble',
        icon: images.icons.game,
      },
      safe_web_ads: {
        name: 'safe_web_ads',
        code: 'safe_web_ads',
        icon: images.icons.ads,
      },
    },
  },
  safe_search: {
    name: 'safe_search',
    code: 'safe_search',
    icon: images.icons.safe_search,
  },
};
