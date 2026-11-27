/**
 * Network event beacon — cookieless, no IP / identifiers, so no consent gate
 * (izn.project.stats/beacon/DESIGN.md). Two plain <script> tags (the static export
 * has no runtime to hydrate next/script): an inline stub that defines `iznTrack` and
 * queues calls into `iznTrackQ`, then the deferred beacon script that drains the
 * queue. Without the stub, events fired on hydration — before b.js loads — are lost.
 * GA4 stays: AdSense needs it; the beacon duplicates it for everyone, not only the
 * few who accept cookies. Use b.izntools.com, never the workers.dev address
 * (ad-blockers cut it).
 */
export function IznBeacon() {
  const stub =
    "window.iznTrack=window.iznTrack||function(){(window.iznTrackQ=window.iznTrackQ||[]).push(arguments)};";
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: stub }} />
      <script defer src="https://b.izntools.com/b.js" />
    </>
  );
}
