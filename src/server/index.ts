import Config from '@common/config';
import { Greetings } from '@common/index';
import { addCommand, cache } from '@communityox/ox_lib/server';
import { Debug } from '@common/debug';

Greetings();

if (Config.EnableNuiCommand) {
  addCommand('openNui', async (playerId) => {
    if (!playerId) return;

    emitNet(`${cache.resource}:openNui`, playerId);
  });
}
