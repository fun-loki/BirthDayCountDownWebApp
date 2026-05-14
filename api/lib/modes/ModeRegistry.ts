import type { CaptionMode } from '../types.js'
import { BaseMode } from './BaseMode.js'

import { DadMode } from './modes/DadMode.js'
import { MomMode } from './modes/MomMode.js'
import { BrotherMode } from './modes/BrotherMode.js'
import { BestFriendMode } from './modes/BestFriendMode.js'
import { BoyfriendMode } from './modes/BoyfriendMode.js'
import { HusbandMode } from './modes/HusbandMode.js'
import { FlirtyMode } from './modes/FlirtyMode.js'
import { EnemyMode } from './modes/EnemyMode.js'
import { TaporiMode } from './modes/TaporiMode.js'

const ALL_MODES: BaseMode[] = [
  new DadMode(),
  new MomMode(),
  new BrotherMode(),
  new BestFriendMode(),
  new BoyfriendMode(),
  new HusbandMode(),
  new FlirtyMode(),
  new EnemyMode(),
  new TaporiMode(),
]

export class ModeRegistry {
  private readonly modes = new Map<CaptionMode, BaseMode>(ALL_MODES.map((mode) => [mode.id, mode]))

  public getMode(modeId: CaptionMode): BaseMode {
    const mode = this.modes.get(modeId)
    if (!mode) {
      throw new Error(`Unknown caption mode: ${modeId}`)
    }
    return mode
  }
}
