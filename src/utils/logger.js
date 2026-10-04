// Kept for existing call sites; new code should import from
// '@/telemetry' directly. Same scrubbing and de-duplication either way.
import { log, reportError, trackEvent } from '@/telemetry';

export const logger = {
    info: (msg, attrs) => log('info', msg, attrs),
    warn: (msg, attrs) => log('warn', msg, attrs),
    error: (err, attrs) => reportError(err, attrs),
    event: (name, attrs) => trackEvent(name, attrs),
};
