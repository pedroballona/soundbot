import { SlashCommandBuilder } from '@discordjs/builders';
import { getVoiceConnection, joinVoiceChannel } from '@discordjs/voice';
import { CommandInteraction, GuildMember } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Makes Wall-E join a voice channel'),
  async execute(interaction: CommandInteraction) {
    const member: GuildMember = interaction.member as GuildMember;
    if (interaction.guild == null) {
      return interaction.reply({
        content: 'This command can only be used on servers.',
        ephemeral: true,
      });
    }
    if (!member.voice.channel) {
      return interaction.reply({
        content: "You're not in a voice channel.",
        ephemeral: true,
      });
    }
    const connection = getVoiceConnection(interaction.guild.id);
    if (connection != null) {
      return interaction.reply({
        content: "I'm already in a voice channel.",
        ephemeral: true,
      });
    }
    joinVoiceChannel({
      channelId: member.voice.channel.id,
      guildId: member.voice.channel.guild.id,
      adapterCreator: member.voice.channel.guild.voiceAdapterCreator,
    });
    return interaction.reply('Hello!');
  },
};
