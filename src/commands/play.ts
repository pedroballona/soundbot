import { SlashCommandBuilder } from '@discordjs/builders';
import {
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { CommandInteraction, GuildMember } from 'discord.js';
import { getAudioPlayerForGuild, getAudioResource } from '../audio';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Makes Wall-E play a sound')
    .addStringOption((option) => option
      .setName('code')
      .setRequired(true)
      .setDescription('Enter the code of a sound')),
  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();
    if (
      !(interaction.member instanceof GuildMember)
      || !interaction.member.voice.channel
      || !interaction.guildId
    ) {
      await interaction.editReply('You have to be in a voice channel');
      return;
    }
    const { channel } = interaction.member.voice;
    let connection = getVoiceConnection(interaction.guildId);
    if (connection == null) {
      connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
    }
    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
      const player = getAudioPlayerForGuild(channel.guildId);
      const soundCode = interaction.options.getString('code');
      if (soundCode == null) {
        await interaction.editReply('You must provide a valid sound code :(');
        return;
      }
      const resource = getAudioResource(soundCode);
      if (resource == null) {
        await interaction.editReply(
          'The provided code does not match a known sound :(',
        );
        return;
      }
      player.play(resource);
      const subscription = connection.subscribe(player);
      if (subscription) {
        // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
        setTimeout(() => subscription.unsubscribe(), 5_000);
      }
      await interaction.editReply(
        `<@${interaction.user.id}> is playing ${soundCode}! :D`,
      );
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "We're experiencing difficulties, try again later.",
      );
    }
  },
};
