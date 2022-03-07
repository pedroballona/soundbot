import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getAudioKeys } from '../audio';

export default {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('List all sound codes'),
  async execute(interaction: CommandInteraction) {
    return interaction.reply(getAudioKeys().join('\n'));
  },
};
