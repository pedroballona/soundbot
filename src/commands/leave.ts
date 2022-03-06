import { SlashCommandBuilder } from '@discordjs/builders';
import { getVoiceConnection } from '@discordjs/voice';
import { CommandInteraction } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Makes Wall-E leaves the voice channel he is in'),
  async execute(interaction: CommandInteraction) {
    if (interaction.guild == null) {
      return interaction.reply({
        content: 'This command can only be used on servers.',
        ephemeral: true,
      });
    }
    const connection = getVoiceConnection(interaction.guild.id);
    if (connection == null) {
      return interaction.reply({
        content: "I'm not in a voice channel right now.",
        ephemeral: true,
      });
    }
    connection.destroy();
    return interaction.reply('Bye bye!');
  },
};
