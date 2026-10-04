// Deployment markers for the browser app, through New Relic change
// tracking (NerdGraph). A marker shows up on the app's charts and in the
// "Change tracking" view, and its version is the `application.version`
// every page reports (build-info.js), so errors and timings can be
// compared release by release. The REST deployments API is on its way
// out; change tracking replaces it.
// https://docs.newrelic.com/docs/change-tracking/change-tracking-graphql/

import { Buffer } from 'node:buffer';

// US datacenter; EU accounts use api.eu.newrelic.com.
export const NERDGRAPH_API = 'https://api.newrelic.com/graphql';
export const REQUEST_TIMEOUT_MS = 10000;
// New Relic's error messages, clipped for the deploy log.
const MAX_MESSAGE_LENGTH = 300;

/**
 * The entity GUID of a browser app: "accountId|BROWSER|APPLICATION|appId"
 * in URL-safe base64, without padding.
 * @param {string} accountId
 * @param {string} applicationId
 * @return {string}
 */
export function browserEntityGuid(accountId, applicationId) {
    return Buffer.from(
        `${accountId}|BROWSER|APPLICATION|${applicationId}`,
    ).toString('base64url');
}

// A GraphQL string literal. JSON strings are valid GraphQL strings, so a
// value can't end the literal early, whatever it holds.
function literal(value) {
    return JSON.stringify(String(value));
}

/**
 * The changeTrackingCreateEvent mutation for one deployment, with the
 * values inlined as string literals. Optional fields that are not given
 * are left out.
 * @param {object} event
 * @param {string} event.entityGuid
 * @param {string} event.version
 * @param {string} [event.commit]
 * @param {string} [event.deepLink] URL of the deploy
 * @param {string} [event.description]
 * @param {string} [event.groupId] ties the events of one deploy together
 * @return {string}
 */
export function deploymentMutation({
    entityGuid,
    version,
    commit,
    deepLink,
    description,
    groupId,
}) {
    const deployment = [
        `version: ${literal(version)}`,
        commit && `commit: ${literal(commit)}`,
        deepLink && `deepLink: ${literal(deepLink)}`,
    ].filter(Boolean);
    const event = [
        'categoryAndTypeData: { ' +
            'kind: { category: "deployment", type: "basic" }, ' +
            `categoryFields: { deployment: { ${deployment.join(', ')} } } }`,
        `entitySearch: { query: ${literal(`id = '${entityGuid}'`)} }`,
        description && `description: ${literal(description)}`,
        groupId && `groupId: ${literal(groupId)}`,
    ].filter(Boolean);
    return (
        'mutation { changeTrackingCreateEvent(changeTrackingEvent: { ' +
        `${event.join(', ')} }) ` +
        '{ changeTrackingEvent { changeTrackingId } messages } }'
    );
}

function clip(text) {
    return text.length > MAX_MESSAGE_LENGTH
        ? `${text.slice(0, MAX_MESSAGE_LENGTH)}...`
        : text;
}

/**
 * Record a deployment of the browser app. Resolves to the change
 * tracking ID and any messages New Relic sent back (such as a trimmed
 * field); rejects when the marker was not recorded. Error messages never
 * include the key.
 * @param {object} options the fields of deploymentMutation(), and:
 * @param {string} options.apiKey user API key (NRAK-...)
 * @param {typeof fetch} [options.fetchImpl]
 * @param {number} [options.timeoutMs]
 * @return {Promise<{ id: string, messages: string[] }>}
 */
export async function recordDeployment({
    apiKey,
    fetchImpl = fetch,
    timeoutMs = REQUEST_TIMEOUT_MS,
    ...event
}) {
    let response;
    try {
        response = await fetchImpl(NERDGRAPH_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'API-Key': apiKey,
            },
            body: JSON.stringify({ query: deploymentMutation(event) }),
            signal: AbortSignal.timeout(timeoutMs),
        });
    } catch (error) {
        throw new Error(`[newrelic] could not reach NerdGraph: ${error}`);
    }
    if (!response.ok) {
        await response.body?.cancel().catch(() => {});
        // 401 or 403 is a wrong key, or one without access to the app.
        throw new Error(`[newrelic] NerdGraph answered ${response.status}`);
    }
    let body;
    try {
        body = await response.json();
    } catch (error) {
        throw new Error(
            `[newrelic] NerdGraph sent back no JSON (${error.name})`,
        );
    }
    // GraphQL reports errors with a 200.
    if (body?.errors?.length) {
        const messages = body.errors.map((error) => String(error?.message));
        throw new Error(
            '[newrelic] NerdGraph refused the deployment: ' +
                clip(messages.join('; ')),
        );
    }
    const result = body?.data?.changeTrackingCreateEvent;
    const id = result?.changeTrackingEvent?.changeTrackingId;
    if (!id) {
        throw new Error('[newrelic] NerdGraph sent back no change tracking ID');
    }
    const messages = Array.isArray(result.messages) ? result.messages : [];
    return { id: String(id), messages: messages.map(String) };
}
