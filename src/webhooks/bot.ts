import type {
  IsoDateTimeString,
  RecallWebhookEnvelope,
  WithUnknown,
} from './shared'

export const BOT_WEBHOOK_EVENT_NAMES = [
  'bot.status_change',
  'bot.log',
  'bot.output_log',
] as const

export type BotWebhookEventName = (typeof BOT_WEBHOOK_EVENT_NAMES)[number]

export const BOT_STATUS_CODES = [
  'ready',
  'joining_call',
  'in_waiting_room',
  'in_call_not_recording',
  'recording_permission_allowed',
  'recording_permission_denied',
  'in_call_recording',
  'recording_done',
  'call_ended',
  'done',
  'fatal',
  'analysis_done',
  'analysis_failed',
  'media_expired',
] as const

export type KnownBotStatusCode = (typeof BOT_STATUS_CODES)[number]
export type BotStatusCode = WithUnknown<KnownBotStatusCode>

export const CALL_ENDED_SUB_CODES = [
  'call_ended_by_host',
  'call_ended_by_platform_idle',
  'call_ended_by_platform_max_length',
  'call_ended_by_platform_waiting_room_timeout',
  'timeout_exceeded_waiting_room',
  'timeout_exceeded_noone_joined',
  'timeout_exceeded_everyone_left',
  'timeout_exceeded_silence_detected',
  'timeout_exceeded_only_bots_detected_using_participant_names',
  'timeout_exceeded_only_bots_detected_using_participant_events',
  'timeout_exceeded_in_call_not_recording',
  'timeout_exceeded_in_call_recording',
  'timeout_exceeded_recording_permission_denied',
  'timeout_exceeded_max_duration',
  'bot_kicked_from_call',
  'bot_kicked_from_waiting_room',
  'bot_received_leave_call',
] as const

export type KnownCallEndedSubCode = (typeof CALL_ENDED_SUB_CODES)[number]
export type CallEndedSubCode = WithUnknown<KnownCallEndedSubCode>

export const RECORDING_PERMISSION_DENIED_SUB_CODES = [
  'zoom_local_recording_disabled',
  'zoom_local_recording_request_disabled',
  'zoom_local_recording_request_disabled_by_host',
  'zoom_bot_in_waiting_room',
  'zoom_host_not_present',
  'zoom_local_recording_request_denied_by_host',
  'zoom_local_recording_denied',
  'zoom_local_recording_grant_not_supported',
  'zoom_sdk_key_blocked_by_host_admin',
] as const

export type KnownRecordingPermissionDeniedSubCode =
  (typeof RECORDING_PERMISSION_DENIED_SUB_CODES)[number]
export type RecordingPermissionDeniedSubCode =
  WithUnknown<KnownRecordingPermissionDeniedSubCode>

export const FATAL_SUB_CODES = [
  'bot_errored',
  'meeting_not_found',
  'meeting_not_started',
  'meeting_requires_registration',
  'meeting_requires_sign_in',
  'meeting_link_expired',
  'meeting_link_invalid',
  'meeting_password_incorrect',
  'meeting_locked',
  'meeting_full',
  'meeting_ended',
  'failed_to_launch_in_time',
  'zoom_sdk_credentials_missing',
  'zoom_sdk_update_required',
  'zoom_sdk_app_not_published',
  'zoom_email_blocked_by_admin',
  'zoom_registration_required',
  'zoom_captcha_required',
  'zoom_account_blocked',
  'zoom_invalid_join_token',
  'zoom_invalid_signature',
  'zoom_internal_error',
  'zoom_join_timeout',
  'zoom_email_required',
  'zoom_web_disallowed',
  'zoom_connection_failed',
  'zoom_error_multiple_device_join',
  'zoom_meeting_not_accessible',
  'zoom_meeting_host_inactive',
  'zoom_invalid_webinar_invite',
  'zoom_another_meeting_in_progress',
  'google_meet_internal_error',
  'google_meet_sign_in_failed',
  'google_meet_sign_in_captcha_failed',
  'google_meet_bot_blocked',
  'google_meet_sso_sign_in_failed',
  'google_meet_sign_in_missing_login_credentials',
  'google_meet_sign_in_missing_recovery_credentials',
  'google_meet_sso_sign_in_missing_login_credentials',
  'google_meet_sso_sign_in_missing_totp_secret',
  'google_meet_video_error',
  'google_meet_meeting_room_not_ready',
  'google_meet_login_not_available',
  'google_meet_permission_denied_breakout',
  'google_meet_knocking_disabled',
  'microsoft_teams_sign_in_credentials_missing',
  'microsoft_teams_call_dropped',
  'microsoft_teams_sign_in_failed',
  'microsoft_teams_internal_error',
  'microsoft_teams_captcha_error',
  'microsoft_teams_bot_not_invited',
  'microsoft_teams_breakout_room_unsupported',
  'microsoft_teams_event_not_started_for_external',
  'microsoft_teams_2fa_required',
  'webex_join_meeting_error',
] as const

export type KnownFatalSubCode = (typeof FATAL_SUB_CODES)[number]
export type FatalSubCode = WithUnknown<KnownFatalSubCode>

type BotStatusBase = {
  created_at: IsoDateTimeString
  message?: string | null
  recording_id?: string
}

type BotStatusWithSubCode<
  Code extends BotStatusCode,
  SubCode extends string,
> = BotStatusBase & {
  code: Code
  sub_code: WithUnknown<SubCode>
  message: string
}

type BotStatusWithoutSubCode = BotStatusBase & {
  code: Exclude<
    KnownBotStatusCode,
    'call_ended' | 'fatal' | 'recording_permission_denied'
  >
  sub_code?: null
}

type BotStatusUnknown = BotStatusBase & {
  code: string
  sub_code?: string | null
}

export type BotStatus =
  | BotStatusWithSubCode<'call_ended', KnownCallEndedSubCode>
  | BotStatusWithSubCode<'fatal', KnownFatalSubCode>
  | BotStatusWithSubCode<
      'recording_permission_denied',
      KnownRecordingPermissionDeniedSubCode
    >
  | BotStatusWithoutSubCode
  | BotStatusUnknown

export type BotStatusChangeData = {
  bot_id: string
  status: BotStatus
}

export type BotStatusChangeEvent = RecallWebhookEnvelope<
  'bot.status_change',
  BotStatusChangeData
>

export type BotLogLevel = WithUnknown<
  'debug' | 'info' | 'warn' | 'warning' | 'error' | 'critical'
>

export type BotLogEntry = {
  created_at: IsoDateTimeString
  level: BotLogLevel
  message: string
  output_id: string | null
}

type BotLogOwner =
  | {
      bot_id: string
      job_id?: string
    }
  | {
      bot_id?: string
      job_id: string
    }

export type BotLogData = BotLogOwner & {
  log: BotLogEntry
}

export type BotLogEvent = RecallWebhookEnvelope<'bot.log', BotLogData>

export type BotOutputLogEvent = RecallWebhookEnvelope<
  'bot.output_log',
  BotLogData
>

export type BotWebhookEvent =
  | BotStatusChangeEvent
  | BotLogEvent
  | BotOutputLogEvent
