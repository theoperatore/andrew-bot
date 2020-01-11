import fetch from 'isomorphic-unfetch';
import { GroupMeResponse } from './types';

export const postToGroupme = (message: GroupMeResponse) =>
  fetch(`https://api.groupme.com/v3/bots/post?token=${process.env.GM_TOKEN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bot_id: message.bot_id,
      text: message.text,
      picture_url: message.image,
    }),
  });
