import process from 'node:process'
import readline from 'node:readline'
import { createInterface } from 'node:readline/promises'
import { RecallSdk } from '../src'

async function promptForApiKey(): Promise<string> {
  const envKey = process.env.RECALL_API_KEY?.trim()
  if (envKey) {
    return envKey
  }

  if (!process.stdin.isTTY) {
    throw new Error(
      'Set RECALL_API_KEY in the environment when running non-interactively.',
    )
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  try {
    const answer = (await rl.question('Recall API key: ')).trim()
    if (!answer) {
      throw new Error('An API key is required to run this demo.')
    }
    process.env.RECALL_API_KEY = answer
    return answer
  } finally {
    rl.close()
  }
}

async function promptForMeetingUrl(): Promise<string> {
  const cliArg = process.argv[2]
  if (cliArg) {
    return cliArg.trim()
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  try {
    const answer = (await rl.question('Meeting URL: ')).trim()
    if (!answer) {
      throw new Error('Meeting URL is required.')
    }
    return answer
  } finally {
    rl.close()
  }
}

async function run(): Promise<void> {
  const apiKey = await promptForApiKey()
  const meetingUrl = await promptForMeetingUrl()

  const recall = new RecallSdk({ apiKey })
  const bot = await recall.bot.create({
    meeting_url: meetingUrl,
    bot_name: `SDK demo ${new Date().toISOString()}`,
  })

  console.log('\nBot created successfully!')
  console.log(`ID: ${bot.id}`)
  console.log('Structured meeting_url payload:')
  console.log(JSON.stringify(bot.meeting_url, null, 2))

  let isCleaningUp = false

  const cleanup = async () => {
    if (isCleaningUp) {
      return
    }
    isCleaningUp = true

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false)
    }
    process.stdin.pause()

    try {
      console.log('\nStopping bot…')
      await recall.bot.leaveCall(bot.id)
      console.log('Bot left the meeting.')
    } catch (error) {
      console.error('Failed to remove bot from call:', error)
    } finally {
      process.exit(0)
    }
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)

  readline.emitKeypressEvents(process.stdin)
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
  }
  process.stdin.resume()

  console.log('\nPress "y" to fetch the bot status, or Ctrl+C to stop and remove the bot.')

  let fetching = false

  process.stdin.on('keypress', async (str, key) => {
    if (key && key.ctrl && key.name === 'c') {
      await cleanup()
      return
    }

    if (str?.toLowerCase() === 'y') {
      if (fetching) {
        console.log('Already fetching bot state…')
        return
      }
      try {
        fetching = true
        const current = await recall.bot.retrieve(bot.id)
        console.log('\nLatest bot state:')
        console.log(JSON.stringify(current, null, 2))
      } catch (error) {
        console.error('Failed to fetch bot info:', error)
      } finally {
        fetching = false
      }
    }
  })
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
