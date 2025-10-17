import * as z from 'zod/v4'

// ============================================================================
// Status Code Enums
// ============================================================================

/**
 * Bot status codes representing the lifecycle of a bot
 */
export type BotStatusCode = z.infer<typeof BotStatusCode>
export const BotStatusCode = z.enum([
  'joining_call',
  'in_waiting_room',
  'in_call_not_recording',
  'recording_permission_allowed',
  'recording_permission_denied',
  'in_call_recording',
  'call_ended',
  'done',
  'fatal',
])

/**
 * Sub-codes for recording_permission_denied status specific to Zoom
 */
export type ZoomRecordingPermissionDeniedSubCode = z.infer<
  typeof ZoomRecordingPermissionDeniedSubCode
>
export const ZoomRecordingPermissionDeniedSubCode = z.enum([
  'zoom_local_recording_disabled',
  'zoom_local_recording_request_disabled',
  'zoom_local_recording_request_disabled_by_host',
  'zoom_bot_in_waiting_room',
  'zoom_host_not_present',
  'zoom_local_recording_request_denied_by_host',
  'zoom_local_recording_denied',
  'zoom_local_recording_grant_not_supported',
  'zoom_sdk_key_blocked_by_host_admin',
])

/**
 * Sub-codes for call_ended status providing context on why the call ended
 */
export type CallEndedSubCode = z.infer<typeof CallEndedSubCode>
export const CallEndedSubCode = z.enum([
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
])

/**
 * Generic fatal error sub-codes (platform-agnostic)
 */
export type GenericFatalSubCode = z.infer<typeof GenericFatalSubCode>
export const GenericFatalSubCode = z.enum([
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
])

/**
 * Zoom-specific fatal error sub-codes
 */
export const ZoomFatalSubCode = z.enum([
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
])

export type ZoomFatalSubCode = z.infer<typeof ZoomFatalSubCode>

/**
 * Google Meet-specific fatal error sub-codes
 */
export const GoogleMeetFatalSubCode = z.enum([
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
  'google_meet_watermark_kicked',
])

export type GoogleMeetFatalSubCode = z.infer<typeof GoogleMeetFatalSubCode>

/**
 * Microsoft Teams-specific fatal error sub-codes
 */
export const MicrosoftTeamsFatalSubCode = z.enum([
  'microsoft_teams_sign_in_credentials_missing',
  'microsoft_teams_call_dropped',
  'microsoft_teams_sign_in_failed',
  'microsoft_teams_internal_error',
  'microsoft_teams_captcha_error',
  'microsoft_teams_bot_not_invited',
  'microsoft_teams_breakout_room_unsupported',
  'microsoft_teams_event_not_started_for_external',
  'microsoft_teams_2fa_required',
])

export type MicrosoftTeamsFatalSubCode = z.infer<
  typeof MicrosoftTeamsFatalSubCode
>

/**
 * Webex-specific fatal error sub-codes
 */
export const WebexFatalSubCode = z.enum(['webex_join_meeting_error'])

export type WebexFatalSubCode = z.infer<typeof WebexFatalSubCode>

/**
 * All possible fatal error sub-codes (union of all platform-specific codes)
 */
export const FatalSubCode = z.union([
  GenericFatalSubCode,
  ZoomFatalSubCode,
  GoogleMeetFatalSubCode,
  MicrosoftTeamsFatalSubCode,
  WebexFatalSubCode,
])

export type FatalSubCode = z.infer<typeof FatalSubCode>

// ============================================================================
// Common Schemas
// ============================================================================

/**
 * Information about a bot
 */
export type BotInformation = z.infer<typeof BotInformation>
export const BotInformation = z.object({
  /** The unique identifier of the bot */
  id: z.string(),
  /** Additional metadata associated with the bot */
  metadata: z.record(z.string(), z.unknown()),
})

/**
 * Information about a recording
 */
export type RecordingInformation = z.infer<typeof RecordingInformation>
export const RecordingInformation = z.object({
  /** The unique identifier of the recording */
  id: z.string(),
  /** Additional metadata associated with the recording */
  metadata: z.record(z.string(), z.unknown()),
})

/**
 * Status information with code, optional sub-code, and timestamp
 */
export type StatusData = z.infer<typeof StatusData>
export const StatusData = z.object({
  /** The status code */
  code: z.string(),
  /** Optional status sub-code */
  sub_code: z.string().nullable(),
  /** The timestamp when the status was updated */
  updated_at: z.iso.datetime({ offset: true }),
})

/**
 * Error information for failed events
 */
export type ErrorInformation = z.infer<typeof ErrorInformation>
export const ErrorInformation = z.object({
  /** Machine-readable error code */
  code: z.string(),
  /** Human-readable error message */
  message: z.string(),
})

/**
 * Status data with error details for failed events
 */
export type StatusDataWithError = z.infer<typeof StatusDataWithError>
export const StatusDataWithError = z.object({
  /** The status code */
  code: z.string(),
  /** Optional status sub-code */
  sub_code: z.string().nullable(),
  /** The timestamp when the status was updated */
  updated_at: z.iso.datetime({ offset: true }),
  /** Details about the error that occurred */
  error: ErrorInformation,
})

/**
 * Information about an audio mixed artifact
 */
export type AudioMixedInformation = z.infer<typeof AudioMixedInformation>
export const AudioMixedInformation = z.object({
  /** The unique identifier of the audio mixed */
  id: z.string(),
  /** Additional metadata associated with the audio mixed */
  metadata: z.record(z.string(), z.unknown()),
})

/**
 * Information about an audio separate artifact
 */
export type AudioSeparateInformation = z.infer<typeof AudioSeparateInformation>
export const AudioSeparateInformation = z.object({
  /** The unique identifier of the audio separate */
  id: z.string(),
  /** Additional metadata associated with the audio separate */
  metadata: z.record(z.string(), z.unknown()),
})

/**
 * Information about meeting metadata
 */
export type MeetingMetadataInformation = z.infer<
  typeof MeetingMetadataInformation
>
export const MeetingMetadataInformation = z.object({
  /** The unique identifier of the meeting metadata */
  id: z.string(),
  /** Additional metadata associated with the meeting metadata */
  metadata: z.record(z.string(), z.unknown()),
})

/**
 * Information about participant events
 */
export type ParticipantEventsInformation = z.infer<
  typeof ParticipantEventsInformation
>
export const ParticipantEventsInformation = z.object({
  /** The unique identifier of the participant events */
  id: z.string(),
  /** Additional metadata associated with the participant events */
  metadata: z.record(z.string(), z.unknown()),
})

/**
 * Information about a transcript
 */
export type TranscriptInformation = z.infer<typeof TranscriptInformation>
export const TranscriptInformation = z.object({
  /** The unique identifier of the transcript */
  id: z.string(),
  /** Additional metadata associated with the transcript */
  metadata: z.record(z.string(), z.unknown()),
})

/**
 * Information about a video mixed artifact
 */
export type VideoMixedInformation = z.infer<typeof VideoMixedInformation>
export const VideoMixedInformation = z.object({
  /** The unique identifier of the video mixed */
  id: z.string(),
  /** Additional metadata associated with the video mixed */
  metadata: z.record(z.string(), z.unknown()),
})

/**
 * Information about a video separate artifact
 */
export type VideoSeparateInformation = z.infer<typeof VideoSeparateInformation>
export const VideoSeparateInformation = z.object({
  /** The unique identifier of the video separate */
  id: z.string(),
  /** Additional metadata associated with the video separate */
  metadata: z.record(z.string(), z.unknown()),
})

/**
 * Information about a realtime endpoint
 */
export type RealtimeEndpointInformation = z.infer<
  typeof RealtimeEndpointInformation
>
export const RealtimeEndpointInformation = z.object({
  /** The unique identifier of the realtime endpoint */
  id: z.string(),
  /** Additional metadata associated with the realtime endpoint */
  metadata: z.record(z.string(), z.unknown()),
})

/**
 * Information about an SDK upload
 */
export type SdkUploadInformation = z.infer<typeof SdkUploadInformation>
export const SdkUploadInformation = z.object({
  /** The unique identifier of the SDK upload */
  id: z.string().uuid(),
  /** Additional metadata associated with the SDK upload */
  metadata: z.record(z.string(), z.unknown()),
})

/**
 * Bot status details
 */
export type BotStatusDetails = z.infer<typeof BotStatusDetails>
export const BotStatusDetails = z.object({
  /** The status code of the bot */
  code: z.string(),
  /** The timestamp when the status was created */
  created_at: z.iso.datetime({ offset: true }),
  /** Optional status message */
  message: z.string().nullable(),
  /** Optional status sub-code */
  sub_code: z.string().nullable(),
})

/**
 * Log details for bot logs
 */
export type LogDetails = z.infer<typeof LogDetails>
export const LogDetails = z.object({
  /** The timestamp when the log was created */
  created_at: z.iso.datetime({ offset: true }),
  /** The severity level of the log */
  level: z.string(),
  /** The content of the log message */
  message: z.string(),
  /** Optional identifier for the output */
  output_id: z.string().nullable(),
})

// ============================================================================
// Audio Mixed Events
// ============================================================================

/**
 * Event emitted when a audio mixed artifact is deleted
 */
export type AudioMixedDeletedEvent = z.infer<typeof AudioMixedDeletedEvent>
export const AudioMixedDeletedEvent = z.object({
  /** The type of the event */
  event: z.literal('audio_mixed.deleted'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the audio mixed */
    audio_mixed: AudioMixedInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a audio mixed artifact is completed
 */
export type AudioMixedDoneEvent = z.infer<typeof AudioMixedDoneEvent>
export const AudioMixedDoneEvent = z.object({
  /** The type of the event */
  event: z.literal('audio_mixed.done'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the audio mixed */
    audio_mixed: AudioMixedInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a audio mixed artifact generation fails
 */
export type AudioMixedFailedEvent = z.infer<typeof AudioMixedFailedEvent>
export const AudioMixedFailedEvent = z.object({
  /** The type of the event */
  event: z.literal('audio_mixed.failed'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the audio mixed */
    audio_mixed: AudioMixedInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a audio mixed artifact is being processed
 */
export type AudioMixedProcessingEvent = z.infer<
  typeof AudioMixedProcessingEvent
>
export const AudioMixedProcessingEvent = z.object({
  /** The type of the event */
  event: z.literal('audio_mixed.processing'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the audio mixed */
    audio_mixed: AudioMixedInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

// ============================================================================
// Audio Separate Events
// ============================================================================

/**
 * Event emitted when a audio separate artifact is deleted
 */
export type AudioSeparateDeletedEvent = z.infer<
  typeof AudioSeparateDeletedEvent
>
export const AudioSeparateDeletedEvent = z.object({
  /** The type of the event */
  event: z.literal('audio_separate.deleted'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the audio separate */
    audio_separate: AudioSeparateInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a audio separate artifact is completed
 */
export type AudioSeparateDoneEvent = z.infer<typeof AudioSeparateDoneEvent>
export const AudioSeparateDoneEvent = z.object({
  /** The type of the event */
  event: z.literal('audio_separate.done'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the audio separate */
    audio_separate: AudioSeparateInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a audio separate artifact generation fails
 */
export type AudioSeparateFailedEvent = z.infer<typeof AudioSeparateFailedEvent>
export const AudioSeparateFailedEvent = z.object({
  /** The type of the event */
  event: z.literal('audio_separate.failed'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the audio separate */
    audio_separate: AudioSeparateInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a audio separate artifact is being processed
 */
export type AudioSeparateProcessingEvent = z.infer<
  typeof AudioSeparateProcessingEvent
>
export const AudioSeparateProcessingEvent = z.object({
  /** The type of the event */
  event: z.literal('audio_separate.processing'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the audio separate */
    audio_separate: AudioSeparateInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

// ============================================================================
// Bot Status Events
// ============================================================================

/**
 * Event emitted when a bot call has ended
 */
export type BotCallEndedEvent = z.infer<typeof BotCallEndedEvent>
export const BotCallEndedEvent = z.object({
  /** The type of the event */
  event: z.literal('bot.call_ended'),
  /** The data payload of the bot event */
  data: z.object({
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: z.object({
      /** The status code of the bot */
      code: z.string(),
      /** Machine readable code for why the call ended */
      sub_code: z.string(),
      /** The timestamp when the status was updated */
      updated_at: z.iso.datetime({ offset: true }),
    }),
  }),
})

/**
 * Event emitted when a bot has shut down
 */
export type BotDoneEvent = z.infer<typeof BotDoneEvent>
export const BotDoneEvent = z.object({
  /** The type of the event */
  event: z.literal('bot.done'),
  /** The data payload of the bot event */
  data: z.object({
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
  }),
})

/**
 * Event emitted when a bot encounters a fatal error
 */
export type BotFatalEvent = z.infer<typeof BotFatalEvent>
export const BotFatalEvent = z.object({
  /** The type of the event */
  event: z.literal('bot.fatal'),
  /** The data payload of the bot event */
  data: z.object({
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: z.object({
      /** The status code of the bot */
      code: z.string(),
      /** Machine readable code for why bot failed */
      sub_code: z.string(),
      /** The timestamp when the status was updated */
      updated_at: z.iso.datetime({ offset: true }),
    }),
  }),
})

/**
 * Event emitted when a bot is in a call but not recording
 */
export type BotInCallNotRecordingEvent = z.infer<
  typeof BotInCallNotRecordingEvent
>
export const BotInCallNotRecordingEvent = z.object({
  /** The type of the event */
  event: z.literal('bot.in_call_not_recording'),
  /** The data payload of the bot event */
  data: z.object({
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
  }),
})

/**
 * Event emitted when a bot is in a call and recording
 */
export type BotInCallRecordingEvent = z.infer<typeof BotInCallRecordingEvent>
export const BotInCallRecordingEvent = z.object({
  /** The type of the event */
  event: z.literal('bot.in_call_recording'),
  /** The data payload of the bot event */
  data: z.object({
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
  }),
})

/**
 * Event emitted when a bot is in the waiting room
 */
export type BotInWaitingRoomEvent = z.infer<typeof BotInWaitingRoomEvent>
export const BotInWaitingRoomEvent = z.object({
  /** The type of the event */
  event: z.literal('bot.in_waiting_room'),
  /** The data payload of the bot event */
  data: z.object({
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
  }),
})

/**
 * Event emitted when a bot is joining a call
 */
export type BotJoiningCallEvent = z.infer<typeof BotJoiningCallEvent>
export const BotJoiningCallEvent = z.object({
  /** The type of the event */
  event: z.literal('bot.joining_call'),
  /** The data payload of the bot event */
  data: z.object({
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
  }),
})

/**
 * Event emitted for bot logs
 */
export type BotLogEvent = z.infer<typeof BotLogEvent>
export const BotLogEvent = z.object({
  /** The type of the event */
  event: z.literal('bot.log'),
  /** The data payload of the log event */
  data: z.object({
    /** The unique identifier of the bot (present for all but async transcription job logs) */
    bot_id: z.string().nullish(),
    /** The unique identifier of the job (present for async transcription job logs) */
    job_id: z.string().nullish(),
    /** The log information */
    log: LogDetails,
  }),
})

/**
 * Event emitted for bot output logs
 */
export type BotOutputLogEvent = z.infer<typeof BotOutputLogEvent>
export const BotOutputLogEvent = z.object({
  /** The type of the event */
  event: z.literal('bot.output_log'),
  /** The data payload of the log event */
  data: z.object({
    /** The unique identifier of the bot (present for all but async transcription job logs) */
    bot_id: z.string().nullish(),
    /** The unique identifier of the job (present for async transcription job logs) */
    job_id: z.string().nullish(),
    /** The log information */
    log: LogDetails,
  }),
})

/**
 * Event emitted when a bot's recording permission is allowed
 */
export type BotRecordingPermissionAllowedEvent = z.infer<
  typeof BotRecordingPermissionAllowedEvent
>
export const BotRecordingPermissionAllowedEvent = z.object({
  /** The type of the event */
  event: z.literal('bot.recording_permission_allowed'),
  /** The data payload of the bot event */
  data: z.object({
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
  }),
})

/**
 * Event emitted when a bot's recording permission is denied
 */
export type BotRecordingPermissionDeniedEvent = z.infer<
  typeof BotRecordingPermissionDeniedEvent
>
export const BotRecordingPermissionDeniedEvent = z.object({
  /** The type of the event */
  event: z.literal('bot.recording_permission_denied'),
  /** The data payload of the bot event */
  data: z.object({
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: z.object({
      /** The status code of the bot */
      code: z.string(),
      /** Machine readable code for why recording permission was denied */
      sub_code: z.string(),
      /** The timestamp when the status was updated */
      updated_at: z.iso.datetime({ offset: true }),
    }),
  }),
})

/**
 * Event emitted when a bot's status changes
 */
export type BotStatusChangeEvent = z.infer<typeof BotStatusChangeEvent>
export const BotStatusChangeEvent = z.object({
  /** The type of the event */
  event: z.literal('bot.status_change'),
  /** The data payload of the status change event */
  data: z.object({
    /** The Recall bot ID */
    bot_id: z.string(),
    /** The status information of the bot */
    status: BotStatusDetails,
  }),
})

// ============================================================================
// Calendar Events
// ============================================================================

/**
 * Event emitted when a calendar syncs its events
 */
export type CalendarSyncEventsEvent = z.infer<typeof CalendarSyncEventsEvent>
export const CalendarSyncEventsEvent = z.object({
  /** The type of the event */
  event: z.literal('calendar.sync_events'),
  /** The data payload of the calendar sync event */
  data: z.object({
    /** The unique identifier of the calendar */
    calendar_id: z.string(),
    /** The timestamp of when the calendar was last synced */
    last_updated_ts: z.iso.datetime({ offset: true }),
  }),
})

/**
 * Event emitted when a calendar is updated
 */
export type CalendarUpdateEvent = z.infer<typeof CalendarUpdateEvent>
export const CalendarUpdateEvent = z.object({
  /** The type of the event */
  event: z.literal('calendar.update'),
  /** The data payload of the calendar update event */
  data: z.object({
    /** The unique identifier of the calendar */
    calendar_id: z.string(),
  }),
})

// ============================================================================
// Meeting Metadata Events
// ============================================================================

/**
 * Event emitted when a meeting metadata artifact is deleted
 */
export type MeetingMetadataDeletedEvent = z.infer<
  typeof MeetingMetadataDeletedEvent
>
export const MeetingMetadataDeletedEvent = z.object({
  /** The type of the event */
  event: z.literal('meeting_metadata.deleted'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the meeting metadata */
    meeting_metadata: MeetingMetadataInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a meeting metadata artifact is completed
 */
export type MeetingMetadataDoneEvent = z.infer<typeof MeetingMetadataDoneEvent>
export const MeetingMetadataDoneEvent = z.object({
  /** The type of the event */
  event: z.literal('meeting_metadata.done'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the meeting metadata */
    meeting_metadata: MeetingMetadataInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a meeting metadata artifact generation fails
 */
export type MeetingMetadataFailedEvent = z.infer<
  typeof MeetingMetadataFailedEvent
>
export const MeetingMetadataFailedEvent = z.object({
  /** The type of the event */
  event: z.literal('meeting_metadata.failed'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the meeting metadata */
    meeting_metadata: MeetingMetadataInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a meeting metadata artifact is being processed
 */
export type MeetingMetadataProcessingEvent = z.infer<
  typeof MeetingMetadataProcessingEvent
>
export const MeetingMetadataProcessingEvent = z.object({
  /** The type of the event */
  event: z.literal('meeting_metadata.processing'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the meeting metadata */
    meeting_metadata: MeetingMetadataInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

// ============================================================================
// Participant Events
// ============================================================================

/**
 * Event emitted when a participant events artifact is deleted
 */
export type ParticipantEventsDeletedEvent = z.infer<
  typeof ParticipantEventsDeletedEvent
>
export const ParticipantEventsDeletedEvent = z.object({
  /** The type of the event */
  event: z.literal('participant_events.deleted'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the participant events */
    participant_events: ParticipantEventsInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a participant events artifact is completed
 */
export type ParticipantEventsDoneEvent = z.infer<
  typeof ParticipantEventsDoneEvent
>
export const ParticipantEventsDoneEvent = z.object({
  /** The type of the event */
  event: z.literal('participant_events.done'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the participant events */
    participant_events: ParticipantEventsInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a participant events artifact generation fails
 */
export type ParticipantEventsFailedEvent = z.infer<
  typeof ParticipantEventsFailedEvent
>
export const ParticipantEventsFailedEvent = z.object({
  /** The type of the event */
  event: z.literal('participant_events.failed'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the participant events */
    participant_events: ParticipantEventsInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a participant events artifact is being processed
 */
export type ParticipantEventsProcessingEvent = z.infer<
  typeof ParticipantEventsProcessingEvent
>
export const ParticipantEventsProcessingEvent = z.object({
  /** The type of the event */
  event: z.literal('participant_events.processing'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the participant events */
    participant_events: ParticipantEventsInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

// ============================================================================
// Realtime Endpoint Events
// ============================================================================

/**
 * Event emitted when a realtime endpoint is completed
 */
export type RealtimeEndpointDoneEvent = z.infer<
  typeof RealtimeEndpointDoneEvent
>
export const RealtimeEndpointDoneEvent = z.object({
  /** The type of the event */
  event: z.literal('realtime_endpoint.done'),
  /** The data payload of the realtime endpoint event */
  data: z.object({
    /** Information about the realtime endpoint */
    realtime_endpoint: RealtimeEndpointInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a realtime endpoint fails
 */
export type RealtimeEndpointFailedEvent = z.infer<
  typeof RealtimeEndpointFailedEvent
>
export const RealtimeEndpointFailedEvent = z.object({
  /** The type of the event */
  event: z.literal('realtime_endpoint.failed'),
  /** The data payload of the realtime endpoint event */
  data: z.object({
    /** Information about the realtime endpoint */
    realtime_endpoint: RealtimeEndpointInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusDataWithError,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a realtime endpoint is running
 */
export type RealtimeEndpointRunningEvent = z.infer<
  typeof RealtimeEndpointRunningEvent
>
export const RealtimeEndpointRunningEvent = z.object({
  /** The type of the event */
  event: z.literal('realtime_endpoint.running'),
  /** The data payload of the realtime endpoint event */
  data: z.object({
    /** Information about the realtime endpoint */
    realtime_endpoint: RealtimeEndpointInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

// ============================================================================
// Recording Events
// ============================================================================

/**
 * Event emitted when a recording is deleted
 */
export type RecordingDeletedEvent = z.infer<typeof RecordingDeletedEvent>
export const RecordingDeletedEvent = z.object({
  /** The type of the event */
  event: z.literal('recording.deleted'),
  /** The data payload of the recording event */
  data: z.object({
    /** Information about the recording */
    recording: RecordingInformation,
    /** Information about the bot that created the recording */
    bot: BotInformation.optional(),
    /** The status information */
    data: StatusData,
  }),
})

/**
 * Event emitted when a recording is completed
 */
export type RecordingDoneEvent = z.infer<typeof RecordingDoneEvent>
export const RecordingDoneEvent = z.object({
  /** The type of the event */
  event: z.literal('recording.done'),
  /** The data payload of the recording event */
  data: z.object({
    /** Information about the recording */
    recording: RecordingInformation,
    /** Information about the bot that created the recording */
    bot: BotInformation.optional(),
    /** The status information */
    data: StatusData,
  }),
})

/**
 * Event emitted when a recording fails
 */
export type RecordingFailedEvent = z.infer<typeof RecordingFailedEvent>
export const RecordingFailedEvent = z.object({
  /** The type of the event */
  event: z.literal('recording.failed'),
  /** The data payload of the recording event */
  data: z.object({
    /** Information about the recording */
    recording: RecordingInformation,
    /** Information about the bot that created the recording */
    bot: BotInformation.optional(),
    /** The status information */
    data: StatusDataWithError,
  }),
})

/**
 * Event emitted when a recording is paused
 */
export type RecordingPausedEvent = z.infer<typeof RecordingPausedEvent>
export const RecordingPausedEvent = z.object({
  /** The type of the event */
  event: z.literal('recording.paused'),
  /** The data payload of the recording event */
  data: z.object({
    /** Information about the recording */
    recording: RecordingInformation,
    /** Information about the bot that created the recording */
    bot: BotInformation.optional(),
    /** The status information */
    data: StatusData,
  }),
})

/**
 * Event emitted when a recording is being processed
 */
export type RecordingProcessingEvent = z.infer<typeof RecordingProcessingEvent>
export const RecordingProcessingEvent = z.object({
  /** The type of the event */
  event: z.literal('recording.processing'),
  /** The data payload of the recording event */
  data: z.object({
    /** Information about the recording */
    recording: RecordingInformation,
    /** Information about the bot that created the recording */
    bot: BotInformation.optional(),
    /** The status information */
    data: StatusData,
  }),
})

// ============================================================================
// SDK Upload Events
// ============================================================================

/**
 * Event emitted when a Desktop SDK upload has completed successfully
 */
export type SdkUploadCompleteEvent = z.infer<typeof SdkUploadCompleteEvent>
export const SdkUploadCompleteEvent = z.object({
  /** The type of the event */
  event: z.literal('sdk_upload.complete'),
  /** The data payload of the SDK upload event */
  data: z.object({
    /** Information about the SDK upload */
    sdk_upload: SdkUploadInformation,
    /** Information about the recording */
    recording: RecordingInformation,
    /** The status information */
    data: z.object({
      /** The status code */
      code: z.literal('complete'),
      /** Optional status sub-code */
      sub_code: z.string().nullable().optional(),
      /** The timestamp when the status was updated */
      updated_at: z.iso.datetime({ offset: true }),
    }),
  }),
})

/**
 * Event emitted when a Desktop SDK upload has failed to complete
 */
export type SdkUploadFailedEvent = z.infer<typeof SdkUploadFailedEvent>
export const SdkUploadFailedEvent = z.object({
  /** The type of the event */
  event: z.literal('sdk_upload.failed'),
  /** The data payload of the SDK upload event */
  data: z.object({
    /** Information about the SDK upload */
    sdk_upload: SdkUploadInformation,
    /** Recording is null if the upload failed */
    recording: z.null(),
    /** The status information */
    data: z.object({
      /** The status code */
      code: z.literal('failed'),
      /** Optional status sub-code */
      sub_code: z.string().nullable().optional(),
      /** The timestamp when the status was updated */
      updated_at: z.iso.datetime({ offset: true }),
    }),
  }),
})

/**
 * Event emitted when a Desktop SDK upload has begun uploading
 */
export type SdkUploadUploadingEvent = z.infer<typeof SdkUploadUploadingEvent>
export const SdkUploadUploadingEvent = z.object({
  /** The type of the event */
  event: z.literal('sdk_upload.uploading'),
  /** The data payload of the SDK upload event */
  data: z.object({
    /** Information about the SDK upload */
    sdk_upload: SdkUploadInformation,
    /** Information about the recording */
    recording: RecordingInformation,
    /** The status information */
    data: z.object({
      /** The status code */
      code: z.literal('uploading'),
      /** Optional status sub-code */
      sub_code: z.string().nullable().optional(),
      /** The timestamp when the status was updated */
      updated_at: z.iso.datetime({ offset: true }),
    }),
  }),
})

// ============================================================================
// Transcript Events
// ============================================================================

/**
 * Event emitted when a transcript artifact is deleted
 */
export type TranscriptDeletedEvent = z.infer<typeof TranscriptDeletedEvent>
export const TranscriptDeletedEvent = z.object({
  /** The type of the event */
  event: z.literal('transcript.deleted'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the transcript */
    transcript: TranscriptInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a transcript artifact is completed
 */
export type TranscriptDoneEvent = z.infer<typeof TranscriptDoneEvent>
export const TranscriptDoneEvent = z.object({
  /** The type of the event */
  event: z.literal('transcript.done'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the transcript */
    transcript: TranscriptInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a transcript artifact generation fails
 */
export type TranscriptFailedEvent = z.infer<typeof TranscriptFailedEvent>
export const TranscriptFailedEvent = z.object({
  /** The type of the event */
  event: z.literal('transcript.failed'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the transcript */
    transcript: TranscriptInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a transcript artifact is being processed
 */
export type TranscriptProcessingEvent = z.infer<
  typeof TranscriptProcessingEvent
>
export const TranscriptProcessingEvent = z.object({
  /** The type of the event */
  event: z.literal('transcript.processing'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the transcript */
    transcript: TranscriptInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

// ============================================================================
// Video Mixed Events
// ============================================================================

/**
 * Event emitted when a video mixed artifact is deleted
 */
export type VideoMixedDeletedEvent = z.infer<typeof VideoMixedDeletedEvent>
export const VideoMixedDeletedEvent = z.object({
  /** The type of the event */
  event: z.literal('video_mixed.deleted'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the video mixed */
    video_mixed: VideoMixedInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a video mixed artifact is completed
 */
export type VideoMixedDoneEvent = z.infer<typeof VideoMixedDoneEvent>
export const VideoMixedDoneEvent = z.object({
  /** The type of the event */
  event: z.literal('video_mixed.done'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the video mixed */
    video_mixed: VideoMixedInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a video mixed artifact generation fails
 */
export type VideoMixedFailedEvent = z.infer<typeof VideoMixedFailedEvent>
export const VideoMixedFailedEvent = z.object({
  /** The type of the event */
  event: z.literal('video_mixed.failed'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the video mixed */
    video_mixed: VideoMixedInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a video mixed artifact is being processed
 */
export type VideoMixedProcessingEvent = z.infer<
  typeof VideoMixedProcessingEvent
>
export const VideoMixedProcessingEvent = z.object({
  /** The type of the event */
  event: z.literal('video_mixed.processing'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the video mixed */
    video_mixed: VideoMixedInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

// ============================================================================
// Video Separate Events
// ============================================================================

/**
 * Event emitted when a video separate artifact is deleted
 */
export type VideoSeparateDeletedEvent = z.infer<
  typeof VideoSeparateDeletedEvent
>
export const VideoSeparateDeletedEvent = z.object({
  /** The type of the event */
  event: z.literal('video_separate.deleted'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the video separate */
    video_separate: VideoSeparateInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a video separate artifact is completed
 */
export type VideoSeparateDoneEvent = z.infer<typeof VideoSeparateDoneEvent>
export const VideoSeparateDoneEvent = z.object({
  /** The type of the event */
  event: z.literal('video_separate.done'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the video separate */
    video_separate: VideoSeparateInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a video separate artifact generation fails
 */
export type VideoSeparateFailedEvent = z.infer<typeof VideoSeparateFailedEvent>
export const VideoSeparateFailedEvent = z.object({
  /** The type of the event */
  event: z.literal('video_separate.failed'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the video separate */
    video_separate: VideoSeparateInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

/**
 * Event emitted when a video separate artifact is being processed
 */
export type VideoSeparateProcessingEvent = z.infer<
  typeof VideoSeparateProcessingEvent
>
export const VideoSeparateProcessingEvent = z.object({
  /** The type of the event */
  event: z.literal('video_separate.processing'),
  /** The data payload of the event */
  data: z.object({
    /** Information about the video separate */
    video_separate: VideoSeparateInformation,
    /** Information about the bot */
    bot: BotInformation,
    /** The status information */
    data: StatusData,
    /** Information about the recording */
    recording: RecordingInformation,
  }),
})

// ============================================================================
// Union Type for All Events
// ============================================================================

/**
 * Union type of all webhook events
 */
export type WebhookEvent = z.infer<typeof WebhookEvent>
export const WebhookEvent = z.discriminatedUnion('event', [
  AudioMixedDeletedEvent,
  AudioMixedDoneEvent,
  AudioMixedFailedEvent,
  AudioMixedProcessingEvent,
  AudioSeparateDeletedEvent,
  AudioSeparateDoneEvent,
  AudioSeparateFailedEvent,
  AudioSeparateProcessingEvent,
  BotCallEndedEvent,
  BotDoneEvent,
  BotFatalEvent,
  BotInCallNotRecordingEvent,
  BotInCallRecordingEvent,
  BotInWaitingRoomEvent,
  BotJoiningCallEvent,
  BotLogEvent,
  BotOutputLogEvent,
  BotRecordingPermissionAllowedEvent,
  BotRecordingPermissionDeniedEvent,
  BotStatusChangeEvent,
  CalendarSyncEventsEvent,
  CalendarUpdateEvent,
  MeetingMetadataDeletedEvent,
  MeetingMetadataDoneEvent,
  MeetingMetadataFailedEvent,
  MeetingMetadataProcessingEvent,
  ParticipantEventsDeletedEvent,
  ParticipantEventsDoneEvent,
  ParticipantEventsFailedEvent,
  ParticipantEventsProcessingEvent,
  RealtimeEndpointDoneEvent,
  RealtimeEndpointFailedEvent,
  RealtimeEndpointRunningEvent,
  RecordingDeletedEvent,
  RecordingDoneEvent,
  RecordingFailedEvent,
  RecordingPausedEvent,
  RecordingProcessingEvent,
  SdkUploadCompleteEvent,
  SdkUploadFailedEvent,
  SdkUploadUploadingEvent,
  TranscriptDeletedEvent,
  TranscriptDoneEvent,
  TranscriptFailedEvent,
  TranscriptProcessingEvent,
  VideoMixedDeletedEvent,
  VideoMixedDoneEvent,
  VideoMixedFailedEvent,
  VideoMixedProcessingEvent,
  VideoSeparateDeletedEvent,
  VideoSeparateDoneEvent,
  VideoSeparateFailedEvent,
  VideoSeparateProcessingEvent,
])

// ============================================================================
// Unknown Webhook Event
// ============================================================================

/**
 * Generic webhook event for unknown event types
 */
export type UnknownWebhookEvent = z.infer<typeof UnknownWebhookEvent>
export const UnknownWebhookEvent = z.object({
  /** The type of the event */
  event: z.string(),
  /** The data payload of the event */
  data: z.unknown(),
})
