import type { CaptionMode, Photo } from '../types.js'

export abstract class BaseMode {
  abstract id: CaptionMode
  abstract relationshipEnergy: string
  abstract humorStyle: string[]
  abstract teasingLevel: 'wholesome' | 'playful' | 'sarcastic' | 'chaotic'
  abstract languageStyle: 'english' | 'hinglish' | 'mixed'
  abstract aggressionLevel: 'protective' | 'gentle' | 'teasing' | 'roasting'
  abstract reactionCategories: string[]
  abstract bannedPhrases: string[]
  abstract examples: string[]

  private getAvoidBlock(recentCaptions: string[]): string {
    return recentCaptions.length > 0
      ? recentCaptions.map((c, i) => `${i + 1}. ${c}`).join('\n')
      : '(none yet)'
  }

  private getBannedPhrasesLine(): string {
    return this.bannedPhrases.length > 0
      ? `NEVER use: ${this.bannedPhrases.join(', ')}`
      : ''
  }

  private getReactionBias(): string {
    return this.reactionCategories.length > 0
      ? `Reaction style preference: ${this.reactionCategories.join(', ')}`
      : ''
  }

  private getLanguageInstructions(): string {
    if (this.languageStyle === 'hinglish') {
      return 'Use natural Hinglish. Think in Hindi, write in English letters.'
    }

    if (this.languageStyle === 'mixed') {
      return 'Mix English and Hinglish naturally. Use words like: acha, itna, kya hi, matlab, kasam se, waise.'
    }

    return 'Use English. Minimize Hinglish.'
  }

  private getExamplesBlock(): string {
    return this.examples.map((ex, i) => `${i + 1}. "${ex}"`).join('\n')
  }

  public buildUserPrompt(photo: Photo, recentCaptions: string[]): string {
    const avoid = this.getAvoidBlock(recentCaptions)
    const bannedPhrases = this.getBannedPhrasesLine()
    const reactionBias = this.getReactionBias()
    const languageStyle = this.getLanguageInstructions()

    return `REACTION COMMENT TASK:
Someone just posted this photo on Instagram/WhatsApp. Write ONE authentic desi reaction comment from this ${this.relationshipEnergy} perspective.

${reactionBias}
Language: ${languageStyle}
${bannedPhrases}
Teasing level: ${this.teasingLevel}
Aggression level: ${this.aggressionLevel}

Example comments from this perspective:
${this.getExamplesBlock()}

Visual context from photo:
- Observable details: ${photo.visuals.join(', ')}

React naturally to these visual details. Keep it short, real, and authentic to this relationship type. No overthinking. No poetry. Just real reaction.

Already used recently - AVOID repeating:
${avoid}`
  }
}
