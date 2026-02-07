import { z } from 'zod'

export const aiProviderSchema = z.enum(['openai', 'deepseek'])

export const aiSettingsSchema = z.object({
  provider: aiProviderSchema,
  apiKey: z.string().min(1, 'API key is required'),
  model: z.string().min(1, 'Model name is required'),
})

export const aiSettingsPublicSchema = z.object({
  provider: aiProviderSchema,
  hasApiKey: z.boolean(),
  model: z.string(),
})

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
})

export type AiProvider = z.infer<typeof aiProviderSchema>
export type AiSettings = z.infer<typeof aiSettingsSchema>
export type AiSettingsPublic = z.infer<typeof aiSettingsPublicSchema>
export type ChatMessage = z.infer<typeof chatMessageSchema>
