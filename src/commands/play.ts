import { SlashCommandBuilder } from '@discordjs/builders';
import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  StreamType,
} from '@discordjs/voice';
import { CommandInteraction } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Makes Wall-E play a sound'),
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
        content: "I'm not in a voice channel right now",
        ephemeral: true,
      });
    }
    const player = createAudioPlayer();
    const giraffeSound = createAudioResource(
      '/home/hao/Neon Pedro/programming/node/wall-e/sounds/giraffe.ogg',
      { inputType: StreamType.OggOpus },
    );
    player.on('stateChange' as any, (oldState: any, newState: any) => {
      console.log(
        `Audio player transitioned from ${oldState.status} to ${newState.status}`,
      );
    });
    player.on('error', (error) => {
      console.error('Error:', error.message, 'with track');
    });
    player.play(giraffeSound);
    const subscription = connection.subscribe(player);
    if (subscription) {
      // Unsubscribe after 5 seconds (stop playing audio on the voice connection)
      setTimeout(() => subscription.unsubscribe(), 5_000);
    }
    return interaction.reply({ content: 'Playing the sound', ephemeral: true });
  },
};
