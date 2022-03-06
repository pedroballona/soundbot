import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'node:fs';
import Configuration from './config';

const commands: any[] = [];

const rest = new REST({ version: '9' }).setToken(Configuration.token);
const commandFiles = fs
  .readdirSync('./dist/commands')
  .filter((file) => file.endsWith('.js'));

commandFiles.forEach((file) => {
  const command = require(`./commands/${file}`).default;
  commands.push(command.data.toJSON());
});

if (Configuration.isDevelopment) {
  console.log('Registering commands...');
  rest
    .put(
      Routes.applicationGuildCommands(
        Configuration.clientId,
        Configuration.guildId,
      ),
      { body: commands },
    )
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
}
