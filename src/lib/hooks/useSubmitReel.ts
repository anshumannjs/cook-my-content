import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  uploadPhotos,
  uploadLogo,
  insertClassicSubmission,
  insertPremiumSubmission,
  generateSubmissionId,
} from '@/lib/queries/submissions'
import { useStudioStore } from '@/lib/store/studioStore'
import type { PlanType } from '@/lib/types'

interface SubmitPayload {
  plan:             PlanType
  email:            string
  name:             string
  phoneNumber:      string | null
  businessName:     string
  businessNiche:    string
  contentType:      string
  contentStyle:     string
  captionType:      string
  platform:         string
  musicMood:        string
  storyContext:     string | null
  photos:           File[]
  logoFile:         File | null
  // Premium only
  emotionIn2Sec?:   string
  reelFeeling?:     string
  visualWorld?:     string
}

export function useSubmitReel() {
  const queryClient = useQueryClient()
  const { setSubmitting, setSubmitSuccess } = useStudioStore()

  return useMutation({
    mutationFn: async (payload: SubmitPayload) => {
      const client       = createClient()
      const submissionId = generateSubmissionId()

      setSubmitting(true)

      // 1. Upload photos
      const photoUrls = await uploadPhotos(
        client,
        payload.photos,
        submissionId,
        payload.email
      )

      // 2. Upload logo if provided
      let logoUrl: string | null = null
      if (payload.logoFile) {
        logoUrl = await uploadLogo(client, payload.logoFile, payload.email)
      }

      // 3. Insert into correct table
      if (payload.plan === 'classic') {
        await insertClassicSubmission(client, {
          submission_id:        submissionId,
          name:                 payload.name,
          email:                payload.email,
          phone_number:         payload.phoneNumber,
          business_name:        payload.businessName,
          business_type_niche:  payload.businessNiche,
          content_type:         payload.contentType,
          'content style':      payload.contentStyle,
          caption_type:         payload.captionType,
          platform:             payload.platform,
          music_mood:           payload.musicMood,
          story_context:        payload.storyContext,
          image_url_quick_post: photoUrls,
          logo_url:             logoUrl,
          plan_type:            'classic',
          status:               'submitted',
        })
      } else {
        await insertPremiumSubmission(client, {
          submission_id:           submissionId,
          name:                    payload.name,
          email:                   payload.email,
          phone_number:            payload.phoneNumber,
          business_name:           payload.businessName,
          business_type_niche:     payload.businessNiche,
          content_type:            payload.contentType,
          'content style':         payload.contentStyle,
          caption_type:            payload.captionType,
          platform:                payload.platform,
          music_mood:              payload.musicMood,
          story_context:           payload.storyContext,
          image_url_quick_post:    photoUrls,
          image_url_AD_generation: photoUrls,
          logo_url:                logoUrl,
          plan_type:               'premium',
          status:                  'submitted',
          emotion_in_2_sec:        payload.emotionIn2Sec ?? '',
          reel_feeling:            payload.reelFeeling   ?? '',
          visual_world:            payload.visualWorld   ?? '',
        })
      }

      return submissionId
    },

    onSuccess: (submissionId) => {
      setSubmitSuccess(true, submissionId)
      // Invalidate library so new entry appears instantly
      queryClient.invalidateQueries({ queryKey: ['library'] })
      queryClient.invalidateQueries({ queryKey: ['usage-limits'] })
    },

    onError: (err: Error) => {
      setSubmitting(false)
      toast.error(err.message ?? 'Something went wrong. Please try again.')
    },
  })
}