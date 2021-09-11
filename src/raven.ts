import type Raven from 'raven'

import os from 'os'

import {
  log,
}           from 'wechaty-puppet'

import {
  VERSION,
  GIT_COMMIT_HASH,
}                   from './config.js'

let raven: typeof Raven

function getRavenDsn (): undefined | string {
  // const RAVEN_DSN = 'https://f6770399ee65459a82af82650231b22c:d8d11b283deb441e807079b8bb2c45cd@sentry.io/179672'
  const dsn = process.env['WECHATY_RAVEN_DSN']
  return dsn
}

function enableRaven (dsn: string):void  {
  /**
   * Raven.io
   */
  const ravenOptions = {
    release: VERSION,
    tags: {
      git_commit: GIT_COMMIT_HASH,
      platform: process.env['WECHATY_DOCKER']
        ? 'docker'
        : os.platform(),
    },
  }

  raven.disableConsoleAlerts()
  raven
    .config(dsn, ravenOptions)
    .install()
}
async function init () {
  try {
    raven = await import('raven')
  } catch (e) {
    // It's ok when there's no raven installed
    log.verbose('Wechaty', 'init() import("raven") failed, ignored.')
    return
  }

  const dsn = getRavenDsn()
  if (!dsn) {
    log.verbose('Wechaty', 'init() getRavenDsn() return undefined, skipped.')
    return
  }

  enableRaven(dsn)
}

function captureException (e: Error) {
  if (raven) {
    raven.captureException(e)
  }
}

init().catch(console.error)

export {
  captureException,
}
