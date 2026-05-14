import type { CaptionMode, Photo } from '../../types.js'
import { ModeRegistry } from '../../modes/ModeRegistry.js'

export class PromptBuilderService {
  private readonly registry = new ModeRegistry()

  public buildUserPrompt(photo: Photo, mode: CaptionMode, recentCaptions: string[]): string {
    const chosenMode = this.registry.getMode(mode)
    return chosenMode.buildUserPrompt(photo, recentCaptions)
  }
}
