import { NextApiRequest, NextApiResponse } from 'next';
// import * as firebaseAdmin from 'firebase-admin';
import { GroupMePostBody, GroupMeSender } from '../../lib/types';
import { postToGroupme } from '../../lib/postToGroupme';
import { Parser } from '../../parser';
import { commandRandom, commandWhoami, commandDnd } from '../../commands';

// const serviceAccount = JSON.parse(
//   Buffer.from(process.env.GCLOUD_CREDENTIALS!, 'base64').toString('utf8')
// );

// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(serviceAccount),
//   databaseURL: 'https://gotd-cde0c.firebaseio.com',
// });

// const db = firebaseAdmin.firestore();
// db.collection('logs')
//   .get()
//   .then(snapshot => {
//     const dat = snapshot.docs.map(doc => {
//       return doc.data();
//     });

//     console.log(dat);
//   });

// TODO: figure out how to map this better...
// maybe these are just more env variables?
const PROD_GROUP_ID = '13613300';
const DEV_GROUP_ID = '17602864';

const groupToBotId = new Map([
  [PROD_GROUP_ID, process.env.PROD_BOT_ID],
  [DEV_GROUP_ID, process.env.DEV_BOT_ID],
]);

const parser = new Parser();

parser.setCommand('gotd', '#gotd - get a round robin GotD', commandRandom);
parser.setCommand('whoami', '#whoami - generate backstory', commandWhoami);
parser.setCommand('dnd', '#dnd <term> - query Roll20 compendium', commandDnd);
parser.setCommand('help', '#help - show this message', async botId => {
  const helpText = `Available commands are:\n\`\`\`\n${parser.formatCommands()}\`\`\``;
  return {
    bot_id: botId,
    text: helpText,
  };
});

export default async function groupme(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(200).send('unsupported method');

  const { group_id, sender_type, text } = req.body as GroupMePostBody;
  const botId = groupToBotId.get(group_id);

  if (sender_type === GroupMeSender.BOT) {
    return res.status(200).send('non-user sender_type');
  }

  if (!text) {
    return res.status(200).send('no text to parse');
  }

  if (!botId) {
    return res.status(200).send('unknown bot id');
  }

  const command = parser.parse(text);
  if (!command) {
    return res.status(200).send('no command found');
  }
  try {
    const groupMeResponse = await command(botId, text);
    await postToGroupme(groupMeResponse);
  } catch (error) {
    // log this error but don't crash
    await postToGroupme({
      bot_id: botId,
      text: `Bzzzzrt! Failed dat command.`,
    });
    console.error('[error]', error);
  }

  return res.status(200).send('success');
}
