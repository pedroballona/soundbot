import { Client, Collection, Intents } from 'discord.js';
import fs from 'node:fs';
import Configuration from './config';

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

const commands = new Collection<string, { execute: Function }>();
const commandFiles = fs
  .readdirSync('./dist/commands')
  .filter((file) => file.endsWith('.js'));

commandFiles.forEach((file) => {
  const command = require(`./commands/${file}`).default;
  commands.set(command.data.name, command);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('[LOG] Ready!');
});

// Login to Discord with your client's token
client.login(Configuration.token);
