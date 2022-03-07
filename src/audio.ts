import {
  AudioPlayer,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  StreamType,
} from '@discordjs/voice';
import { Snowflake } from 'discord.js';
import path from 'node:path';
import fs from 'node:fs';

type GuildId = Snowflake;
type AudioKey = string;

const AudioPlayerCache = new Map<GuildId, AudioPlayer>();
const AudioFolder = path.join(__dirname, '../sounds/');
const AudioResources = new Map<AudioKey, string>();

fs.readdirSync(AudioFolder)
  .filter((file) => file.endsWith('.ogg'))
  .forEach((file) => {
    const key = path.basename(file).split('.')[0];
    const filePath = path.join(AudioFolder, file);
    console.log(`[LOG] Added sound with key: ${key}`);
    AudioResources.set(key, filePath);
  });

export function getAudioPlayerForGuild(guildId: GuildId): AudioPlayer {
  let audioPlayer = AudioPlayerCache.get(guildId);
  if (audioPlayer == null) {
    audioPlayer = createAudioPlayer();
    AudioPlayerCache.set(guildId, audioPlayer);
  }
  return audioPlayer;
}

export function getAudioResource(audioKey: AudioKey): AudioResource | null {
  const audioPath = AudioResources.get(audioKey);
  if (audioPath == null) {
    return null;
  }
  return createAudioResource(audioPath, { inputType: StreamType.OggOpus });
}

export function getAudioKeys(): string[] {
  return [...AudioResources.keys()];
}
