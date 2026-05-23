export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    graphql_public: {
        Tables: {
            [_ in never]: never
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            graphql: {
                Args: {
                    extensions?: Json
                    operationName?: string
                    query?: string
                    variables?: Json
                }
                Returns: Json
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
    public: {
        Tables: {
            BMC_limit_usage: {
                Row: {
                    billing_cycle_end: string | null
                    billing_cycle_key: string | null
                    billing_cycle_start: string | null
                    "blocked until": string | null
                    "Content delivery": string | null
                    cycle_submission_number: number | null
                    decision: string | null
                    email: string | null
                    id: number
                    last_template_used: string | null
                    name: string | null
                    "next cycle": string | null
                    plan_type: string | null
                    reason: string | null
                    submission_id: string | null
                    submitted_at: string | null
                }
                Insert: {
                    billing_cycle_end?: string | null
                    billing_cycle_key?: string | null
                    billing_cycle_start?: string | null
                    "blocked until"?: string | null
                    "Content delivery"?: string | null
                    cycle_submission_number?: number | null
                    decision?: string | null
                    email?: string | null
                    id?: number
                    last_template_used?: string | null
                    name?: string | null
                    "next cycle"?: string | null
                    plan_type?: string | null
                    reason?: string | null
                    submission_id?: string | null
                    submitted_at?: string | null
                }
                Update: {
                    billing_cycle_end?: string | null
                    billing_cycle_key?: string | null
                    billing_cycle_start?: string | null
                    "blocked until"?: string | null
                    "Content delivery"?: string | null
                    cycle_submission_number?: number | null
                    decision?: string | null
                    email?: string | null
                    id?: number
                    last_template_used?: string | null
                    name?: string | null
                    "next cycle"?: string | null
                    plan_type?: string | null
                    reason?: string | null
                    submission_id?: string | null
                    submitted_at?: string | null
                }
                Relationships: []
            }
            classic_engine_slots_duplicate: {
                Row: {
                    assigned_at: string | null
                    created_at: string
                    current_job_id: string | null
                    current_submission_id: string | null
                    engine_name: string
                    engine_status: string
                    id: number
                    last_heartbeat_at: string | null
                    updated_at: string
                }
                Insert: {
                    assigned_at?: string | null
                    created_at?: string
                    current_job_id?: string | null
                    current_submission_id?: string | null
                    engine_name: string
                    engine_status?: string
                    id?: never
                    last_heartbeat_at?: string | null
                    updated_at?: string
                }
                Update: {
                    assigned_at?: string | null
                    created_at?: string
                    current_job_id?: string | null
                    current_submission_id?: string | null
                    engine_name?: string
                    engine_status?: string
                    id?: never
                    last_heartbeat_at?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            classic_job_queue_duplicate: {
                Row: {
                    assigned_at: string | null
                    assigned_engine: string | null
                    completed_at: string | null
                    created_at: string
                    customer_email: string | null
                    error_message: string | null
                    failed_at: string | null
                    id: number
                    job_id: string
                    job_status: string
                    payload: Json | null
                    source_execution_id: string | null
                    source_workflow: string | null
                    submission_id: string | null
                    updated_at: string
                }
                Insert: {
                    assigned_at?: string | null
                    assigned_engine?: string | null
                    completed_at?: string | null
                    created_at?: string
                    customer_email?: string | null
                    error_message?: string | null
                    failed_at?: string | null
                    id?: never
                    job_id: string
                    job_status?: string
                    payload?: Json | null
                    source_execution_id?: string | null
                    source_workflow?: string | null
                    submission_id?: string | null
                    updated_at?: string
                }
                Update: {
                    assigned_at?: string | null
                    assigned_engine?: string | null
                    completed_at?: string | null
                    created_at?: string
                    customer_email?: string | null
                    error_message?: string | null
                    failed_at?: string | null
                    id?: never
                    job_id?: string
                    job_status?: string
                    payload?: Json | null
                    source_execution_id?: string | null
                    source_workflow?: string | null
                    submission_id?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            error_patterns: {
                Row: {
                    auto_resolvable: boolean | null
                    error_signature: string | null
                    fix_success_rate: number | null
                    known_fix: string | null
                    last_seen: string | null
                    node_name: string | null
                    occurrence_count: number | null
                    pattern_id: string
                    requires_escalation: boolean | null
                }
                Insert: {
                    auto_resolvable?: boolean | null
                    error_signature?: string | null
                    fix_success_rate?: number | null
                    known_fix?: string | null
                    last_seen?: string | null
                    node_name?: string | null
                    occurrence_count?: number | null
                    pattern_id?: string
                    requires_escalation?: boolean | null
                }
                Update: {
                    auto_resolvable?: boolean | null
                    error_signature?: string | null
                    fix_success_rate?: number | null
                    known_fix?: string | null
                    last_seen?: string | null
                    node_name?: string | null
                    occurrence_count?: number | null
                    pattern_id?: string
                    requires_escalation?: boolean | null
                }
                Relationships: []
            }
            music_library: {
                Row: {
                    calm_minimal: string | null
                    energetic_bold_motivational: string | null
                    id: number
                    soft_cinematic_emotional: string | null
                    trend_style_modern_vibe: string | null
                    uplifting_happy: string | null
                    warm_acoustic_storytelling: string | null
                }
                Insert: {
                    calm_minimal?: string | null
                    energetic_bold_motivational?: string | null
                    id?: number
                    soft_cinematic_emotional?: string | null
                    trend_style_modern_vibe?: string | null
                    uplifting_happy?: string | null
                    warm_acoustic_storytelling?: string | null
                }
                Update: {
                    calm_minimal?: string | null
                    energetic_bold_motivational?: string | null
                    id?: number
                    soft_cinematic_emotional?: string | null
                    trend_style_modern_vibe?: string | null
                    uplifting_happy?: string | null
                    warm_acoustic_storytelling?: string | null
                }
                Relationships: []
            }
            orders: {
                Row: {
                    completed_at: string | null
                    created_at: string
                    error_message: string | null
                    id: string
                    intake_data: Json
                    n8n_execution_id: string | null
                    reel_urls: Json | null
                    status: string
                    submitted_at: string
                    tier: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    completed_at?: string | null
                    created_at?: string
                    error_message?: string | null
                    id?: string
                    intake_data?: Json
                    n8n_execution_id?: string | null
                    reel_urls?: Json | null
                    status?: string
                    submitted_at?: string
                    tier: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    completed_at?: string | null
                    created_at?: string
                    error_message?: string | null
                    id?: string
                    intake_data?: Json
                    n8n_execution_id?: string | null
                    reel_urls?: Json | null
                    status?: string
                    submitted_at?: string
                    tier?: string
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "orders_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            pipeline_errors: {
                Row: {
                    block_number: number | null
                    claude_consulted: boolean | null
                    claude_diagnosis: string | null
                    error_id: string
                    error_message: string | null
                    error_type: string | null
                    fix_applied: string | null
                    fix_outcome: string | null
                    input_snapshot: Json | null
                    node_name: string | null
                    retry_count: number | null
                    submission_id: string | null
                    timestamp: string | null
                }
                Insert: {
                    block_number?: number | null
                    claude_consulted?: boolean | null
                    claude_diagnosis?: string | null
                    error_id?: string
                    error_message?: string | null
                    error_type?: string | null
                    fix_applied?: string | null
                    fix_outcome?: string | null
                    input_snapshot?: Json | null
                    node_name?: string | null
                    retry_count?: number | null
                    submission_id?: string | null
                    timestamp?: string | null
                }
                Update: {
                    block_number?: number | null
                    claude_consulted?: boolean | null
                    claude_diagnosis?: string | null
                    error_id?: string
                    error_message?: string | null
                    error_type?: string | null
                    fix_applied?: string | null
                    fix_outcome?: string | null
                    input_snapshot?: Json | null
                    node_name?: string | null
                    retry_count?: number | null
                    submission_id?: string | null
                    timestamp?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "pipeline_errors_submission_id_fkey"
                        columns: ["submission_id"]
                        isOneToOne: false
                        referencedRelation: "pipeline_jobs"
                        referencedColumns: ["submission_id"]
                    },
                ]
            }
            pipeline_jobs: {
                Row: {
                    auto_recovered: boolean | null
                    business_type: string | null
                    completed_at: string | null
                    current_block: number | null
                    customer_name: string | null
                    error_count: number | null
                    notified_ceo: boolean | null
                    reel_url: string | null
                    started_at: string | null
                    status: string | null
                    submission_id: string
                    total_duration_ms: number | null
                }
                Insert: {
                    auto_recovered?: boolean | null
                    business_type?: string | null
                    completed_at?: string | null
                    current_block?: number | null
                    customer_name?: string | null
                    error_count?: number | null
                    notified_ceo?: boolean | null
                    reel_url?: string | null
                    started_at?: string | null
                    status?: string | null
                    submission_id: string
                    total_duration_ms?: number | null
                }
                Update: {
                    auto_recovered?: boolean | null
                    business_type?: string | null
                    completed_at?: string | null
                    current_block?: number | null
                    customer_name?: string | null
                    error_count?: number | null
                    notified_ceo?: boolean | null
                    reel_url?: string | null
                    started_at?: string | null
                    status?: string | null
                    submission_id?: string
                    total_duration_ms?: number | null
                }
                Relationships: []
            }
            premium_BMC_limit_usage: {
                Row: {
                    billing_cycle_end: string | null
                    billing_cycle_key: string | null
                    billing_cycle_start: string | null
                    "blocked until": string | null
                    "Content delivery": string | null
                    cycle_submission_number: number | null
                    decision: string | null
                    email: string | null
                    id: number
                    last_template_used: string | null
                    name: string | null
                    "next cycle": string | null
                    plan_type: string | null
                    reason: string | null
                    submission_id: string | null
                    submitted_at: string | null
                }
                Insert: {
                    billing_cycle_end?: string | null
                    billing_cycle_key?: string | null
                    billing_cycle_start?: string | null
                    "blocked until"?: string | null
                    "Content delivery"?: string | null
                    cycle_submission_number?: number | null
                    decision?: string | null
                    email?: string | null
                    id?: number
                    last_template_used?: string | null
                    name?: string | null
                    "next cycle"?: string | null
                    plan_type?: string | null
                    reason?: string | null
                    submission_id?: string | null
                    submitted_at?: string | null
                }
                Update: {
                    billing_cycle_end?: string | null
                    billing_cycle_key?: string | null
                    billing_cycle_start?: string | null
                    "blocked until"?: string | null
                    "Content delivery"?: string | null
                    cycle_submission_number?: number | null
                    decision?: string | null
                    email?: string | null
                    id?: number
                    last_template_used?: string | null
                    name?: string | null
                    "next cycle"?: string | null
                    plan_type?: string | null
                    reason?: string | null
                    submission_id?: string | null
                    submitted_at?: string | null
                }
                Relationships: []
            }
            premium_engine_slots: {
                Row: {
                    assigned_at: string | null
                    created_at: string
                    current_job_id: string | null
                    current_submission_id: string | null
                    engine_name: string
                    engine_status: string
                    id: number
                    last_heartbeat_at: string | null
                    updated_at: string
                }
                Insert: {
                    assigned_at?: string | null
                    created_at?: string
                    current_job_id?: string | null
                    current_submission_id?: string | null
                    engine_name: string
                    engine_status?: string
                    id?: never
                    last_heartbeat_at?: string | null
                    updated_at?: string
                }
                Update: {
                    assigned_at?: string | null
                    created_at?: string
                    current_job_id?: string | null
                    current_submission_id?: string | null
                    engine_name?: string
                    engine_status?: string
                    id?: never
                    last_heartbeat_at?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            premium_job_queue: {
                Row: {
                    assigned_at: string | null
                    assigned_engine: string | null
                    completed_at: string | null
                    created_at: string
                    customer_email: string | null
                    error_message: string | null
                    failed_at: string | null
                    id: number
                    job_id: string
                    job_status: string
                    payload: Json | null
                    source_execution_id: string | null
                    source_workflow: string | null
                    submission_id: string | null
                    updated_at: string
                }
                Insert: {
                    assigned_at?: string | null
                    assigned_engine?: string | null
                    completed_at?: string | null
                    created_at?: string
                    customer_email?: string | null
                    error_message?: string | null
                    failed_at?: string | null
                    id?: never
                    job_id: string
                    job_status?: string
                    payload?: Json | null
                    source_execution_id?: string | null
                    source_workflow?: string | null
                    submission_id?: string | null
                    updated_at?: string
                }
                Update: {
                    assigned_at?: string | null
                    assigned_engine?: string | null
                    completed_at?: string | null
                    created_at?: string
                    customer_email?: string | null
                    error_message?: string | null
                    failed_at?: string | null
                    id?: never
                    job_id?: string
                    job_status?: string
                    payload?: Json | null
                    source_execution_id?: string | null
                    source_workflow?: string | null
                    submission_id?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    business_name: string | null
                    business_niche: string | null
                    created_at: string
                    email: string
                    full_name: string | null
                    id: string
                    logo_url: string | null
                    stripe_customer_id: string | null
                    updated_at: string
                }
                Insert: {
                    business_name?: string | null
                    business_niche?: string | null
                    created_at?: string
                    email: string
                    full_name?: string | null
                    id: string
                    logo_url?: string | null
                    stripe_customer_id?: string | null
                    updated_at?: string
                }
                Update: {
                    business_name?: string | null
                    business_niche?: string | null
                    created_at?: string
                    email?: string
                    full_name?: string | null
                    id?: string
                    logo_url?: string | null
                    stripe_customer_id?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            "shopify subs orders": {
                Row: {
                    amount_paid: Json | null
                    billing_address: Json | null
                    confirmation_number: string | null
                    created_at: string | null
                    email: string | null
                    id: number
                    order_id: number | null
                    order_id_name: string | null
                    phone_number: string | null
                    product_legacy_resource_id: number | null
                    product_title: string | null
                    variant_id: string | null
                }
                Insert: {
                    amount_paid?: Json | null
                    billing_address?: Json | null
                    confirmation_number?: string | null
                    created_at?: string | null
                    email?: string | null
                    id?: number
                    order_id?: number | null
                    order_id_name?: string | null
                    phone_number?: string | null
                    product_legacy_resource_id?: number | null
                    product_title?: string | null
                    variant_id?: string | null
                }
                Update: {
                    amount_paid?: Json | null
                    billing_address?: Json | null
                    confirmation_number?: string | null
                    created_at?: string | null
                    email?: string | null
                    id?: number
                    order_id?: number | null
                    order_id_name?: string | null
                    phone_number?: string | null
                    product_legacy_resource_id?: number | null
                    product_title?: string | null
                    variant_id?: string | null
                }
                Relationships: []
            }
            subscriptions: {
                Row: {
                    cancel_at_period_end: boolean | null
                    canceled_at: string | null
                    created_at: string
                    current_period_end: string | null
                    current_period_start: string | null
                    id: string
                    status: string
                    stripe_customer_id: string
                    stripe_price_id: string
                    stripe_subscription_id: string
                    tier: string
                    trial_end: string | null
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    cancel_at_period_end?: boolean | null
                    canceled_at?: string | null
                    created_at?: string
                    current_period_end?: string | null
                    current_period_start?: string | null
                    id?: string
                    status: string
                    stripe_customer_id: string
                    stripe_price_id: string
                    stripe_subscription_id: string
                    tier: string
                    trial_end?: string | null
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    cancel_at_period_end?: boolean | null
                    canceled_at?: string | null
                    created_at?: string
                    current_period_end?: string | null
                    current_period_start?: string | null
                    id?: string
                    status?: string
                    stripe_customer_id?: string
                    stripe_price_id?: string
                    stripe_subscription_id?: string
                    tier?: string
                    trial_end?: string | null
                    updated_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "subscriptions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            "TALLY BMC CLASSIC": {
                Row: {
                    business_name: string | null
                    business_type_niche: string | null
                    caption_type: string | null
                    "content style": string | null
                    content_type: string | null
                    created_at: string | null
                    email: string | null
                    id: number
                    image_url_quick_post: Json | null
                    logo_url: Json | null
                    music_mood: string | null
                    name: string | null
                    phone_number: string | null
                    plan_type: string | null
                    platform: string | null
                    status: string | null
                    story_context: string | null
                    submission_id: string | null
                }
                Insert: {
                    business_name?: string | null
                    business_type_niche?: string | null
                    caption_type?: string | null
                    "content style"?: string | null
                    content_type?: string | null
                    created_at?: string | null
                    email?: string | null
                    id?: number
                    image_url_quick_post?: Json | null
                    logo_url?: Json | null
                    music_mood?: string | null
                    name?: string | null
                    phone_number?: string | null
                    plan_type?: string | null
                    platform?: string | null
                    status?: string | null
                    story_context?: string | null
                    submission_id?: string | null
                }
                Update: {
                    business_name?: string | null
                    business_type_niche?: string | null
                    caption_type?: string | null
                    "content style"?: string | null
                    content_type?: string | null
                    created_at?: string | null
                    email?: string | null
                    id?: number
                    image_url_quick_post?: Json | null
                    logo_url?: Json | null
                    music_mood?: string | null
                    name?: string | null
                    phone_number?: string | null
                    plan_type?: string | null
                    platform?: string | null
                    status?: string | null
                    story_context?: string | null
                    submission_id?: string | null
                }
                Relationships: []
            }
            "TALLY BMC PREMIUM": {
                Row: {
                    business_name: string | null
                    business_type_niche: string | null
                    caption_type: string | null
                    "content style": string | null
                    content_type: string | null
                    created_at: string | null
                    email: string | null
                    emotion_in_2_sec: string | null
                    id: number
                    image_url_AD_generation: Json | null
                    image_url_quick_post: Json | null
                    logo_url: Json | null
                    music_mood: string | null
                    name: string | null
                    phone_number: string | null
                    plan_type: string | null
                    platform: string | null
                    reel_feeling: string | null
                    status: string | null
                    story_context: string | null
                    submission_id: string | null
                    visual_world: string | null
                }
                Insert: {
                    business_name?: string | null
                    business_type_niche?: string | null
                    caption_type?: string | null
                    "content style"?: string | null
                    content_type?: string | null
                    created_at?: string | null
                    email?: string | null
                    emotion_in_2_sec?: string | null
                    id?: number
                    image_url_AD_generation?: Json | null
                    image_url_quick_post?: Json | null
                    logo_url?: Json | null
                    music_mood?: string | null
                    name?: string | null
                    phone_number?: string | null
                    plan_type?: string | null
                    platform?: string | null
                    reel_feeling?: string | null
                    status?: string | null
                    story_context?: string | null
                    submission_id?: string | null
                    visual_world?: string | null
                }
                Update: {
                    business_name?: string | null
                    business_type_niche?: string | null
                    caption_type?: string | null
                    "content style"?: string | null
                    content_type?: string | null
                    created_at?: string | null
                    email?: string | null
                    emotion_in_2_sec?: string | null
                    id?: number
                    image_url_AD_generation?: Json | null
                    image_url_quick_post?: Json | null
                    logo_url?: Json | null
                    music_mood?: string | null
                    name?: string | null
                    phone_number?: string | null
                    plan_type?: string | null
                    platform?: string | null
                    reel_feeling?: string | null
                    status?: string | null
                    story_context?: string | null
                    submission_id?: string | null
                    visual_world?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    graphql_public: {
        Enums: {},
    },
    public: {
        Enums: {},
    },
} as const
