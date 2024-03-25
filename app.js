import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest, InstallGlobalCommands } from './utils.js';
import { getShuffledOptions, getResult } from './game.js';

// Create an express app
const app = express();
// app.use(cors());

const PORT = process.env.PORT || 443;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));


/**
 * create commands
 */

const TEST_COMMAND = {
  name: 'test',
  description: 'test',
  type: 1,
};

const TEST_COMMAND2 = {
  name: 'whoisthebestplayer',
  description: 'guess who',
  type: 1,
}

const ALL_COMMANDS = [TEST_COMMAND, TEST_COMMAND2];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);





/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world ' + getRandomEmoji(),
        },
      });
    }

    // whoIsTheBest
    if (name === 'whoisthebestplayer') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'https://www.op.gg/summoners/na/Bak%20Cho1-NA1',
        },
      });
    }
  }
});

app.get("/health-check", (req, res) => {
  console.log('heath check called')
  res.send({ data: 'good' })

})
app.get("/", (req, res) => {
  res.send('hello')
})


// app.listen(PORT, () => {
//   console.log('Listening on port', PORT);
// });
//expire 06-20
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/bakcho1.ddns.net/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/bakcho1.ddns.net/fullchain.pem')
};
https.createServer(options, app).listen(PORT || 443, () => console.log(`listening to port ${PORT || 443}`));
