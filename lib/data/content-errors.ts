export class ContentError extends Error {
  constructor(message: string, public readonly status = 400) { super(message); }
}

export function assertVersion(current: { version: number }, version: number | undefined) {
  if (version === undefined || version !== current.version) {
    throw new ContentError('Conflict: Content was updated by another administrator. Refresh and try again.', 409);
  }
}
