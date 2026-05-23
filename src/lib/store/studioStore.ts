import { create } from 'zustand'
import type { PlanType } from '@/lib/types'

interface StudioState {
  // ── Plan selection ─────────────────────────────────────────────────────
  activePlan:      PlanType

  // ── File uploads ───────────────────────────────────────────────────────
  // Classic: 1 photo | Premium: up to 4
  uploadedFiles:   File[]
  logoFile:        File | null

  // ── Submission state ───────────────────────────────────────────────────
  isSubmitting:    boolean
  submitSuccess:   boolean
  submissionId:    string | null

  // ── Actions ────────────────────────────────────────────────────────────
  setActivePlan:   (plan: PlanType) => void
  setUploadedFiles:(files: File[]) => void
  addFile:         (file: File) => void
  removeFile:      (index: number) => void
  setLogoFile:     (file: File | null) => void
  setSubmitting:   (v: boolean) => void
  setSubmitSuccess:(v: boolean, id?: string) => void
  resetUpload:     () => void
  reset:           () => void
}

export const useStudioStore = create<StudioState>()((set, get) => ({
  activePlan:    'classic',
  uploadedFiles: [],
  logoFile:      null,
  isSubmitting:  false,
  submitSuccess: false,
  submissionId:  null,

  setActivePlan: (plan) => set({
    activePlan:    plan,
    uploadedFiles: [],   // clear uploads when switching plan
    submitSuccess: false,
    submissionId:  null,
  }),

  setUploadedFiles: (files) => set({ uploadedFiles: files }),

  addFile: (file) => {
    const { uploadedFiles, activePlan } = get()
    const limit = activePlan === 'classic' ? 1 : 4
    if (uploadedFiles.length >= limit) return
    set({ uploadedFiles: [...uploadedFiles, file] })
  },

  removeFile: (index) => set((state) => ({
    uploadedFiles: state.uploadedFiles.filter((_, i) => i !== index),
  })),

  setLogoFile: (logoFile) => set({ logoFile }),

  setSubmitting: (isSubmitting) => set({ isSubmitting }),

  setSubmitSuccess: (submitSuccess, submissionId = null) =>
    set({ submitSuccess, submissionId, isSubmitting: false }),

  resetUpload: () => set({
    uploadedFiles: [],
    logoFile:      null,
    submitSuccess: false,
    submissionId:  null,
    isSubmitting:  false,
  }),

  reset: () => set({
    activePlan:    'classic',
    uploadedFiles: [],
    logoFile:      null,
    isSubmitting:  false,
    submitSuccess: false,
    submissionId:  null,
  }),
}))

// ─── Selectors ──────────────────────────────────────────────────────────────
export const selectActivePlan    = (s: StudioState) => s.activePlan
export const selectUploadedFiles = (s: StudioState) => s.uploadedFiles
export const selectLogoFile      = (s: StudioState) => s.logoFile
export const selectIsSubmitting  = (s: StudioState) => s.isSubmitting
export const selectSubmitSuccess = (s: StudioState) => s.submitSuccess
export const selectSubmissionId  = (s: StudioState) => s.submissionId
export const selectFileLimit     = (s: StudioState) =>
  s.activePlan === 'classic' ? 1 : 4
export const selectCanAddFile    = (s: StudioState) =>
  s.uploadedFiles.length < (s.activePlan === 'classic' ? 1 : 4)