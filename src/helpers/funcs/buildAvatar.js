import env from '../../environment';
const buildAvatar = avatar => {
  return env.host + avatar;
};

export default buildAvatar;
