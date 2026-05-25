import { describe, expect, test } from 'vitest';
import {
  buildArticleEvidencePacket,
  buildSimulatedCompleteArticleEvidencePacket,
  canReleaseArticleFromEvidencePacket,
  getArticleEvidencePacketSummary,
} from '@/services/content/offline-agri-editorial-evidence';

describe('M70 editorial evidence packet and human release gate', () => {
  test('evidence packet exists for pilot article', () => {
    const packet = buildArticleEvidencePacket('soil-types-before-planting');

    expect(packet.packetId).toBe('soil-types-before-planting-m70-evidence-packet');
    expect(packet.sourceEvidence.length).toBeGreaterThan(0);
    expect(packet.imageEvidence.length).toBeGreaterThan(0);
    expect(packet.reviewerEvidence.length).toBeGreaterThan(0);
  });

  test('release gate exists and blocks final publish', () => {
    const packet = buildArticleEvidencePacket('soil-types-before-planting');

    expect(packet.releaseGate).toBeTruthy();
    expect(packet.releaseGate.finalPublishAllowed).toBe(false);
    expect(packet.releaseGate.automaticPublishAllowed).toBe(false);
    expect(packet.releaseGate.blockers).toContain('metadata_incomplete');
  });

  test('final publish is blocked even when metadata is simulated complete', () => {
    const packet = buildSimulatedCompleteArticleEvidencePacket('soil-types-before-planting');
    const release = canReleaseArticleFromEvidencePacket(packet);

    expect(packet.simulation.metadataCompleted).toBe(true);
    expect(packet.completedEvidenceCount).toBeGreaterThan(0);
    expect(packet.missingEvidenceCount).toBe(0);
    expect(release.canRelease).toBe(false);
    expect(release.blockers).toContain('release_human_approval_missing');
    expect(release.blockers).toContain('automatic_publish_forbidden');
  });

  test('human approval is required', () => {
    const packet = buildSimulatedCompleteArticleEvidencePacket('soil-types-before-planting');

    expect(packet.releaseGate.humanApprovalRequired).toBe(true);
    expect(packet.releaseGate.approvalRequirement.explicitHumanApprovalFlag).toBe(false);
    expect(packet.releaseGate.approvalRequirement.missingFields).toContain('approval_flag');
  });

  test('release reviewer placeholder is required', () => {
    const packet = buildSimulatedCompleteArticleEvidencePacket('soil-types-before-planting');

    expect(packet.releaseGate.releaseReviewerPlaceholder).toBe('release reviewer pending');
    expect(packet.releaseGate.blockers).toContain('release_reviewer_placeholder_required');
  });

  test('release timestamp placeholder is required', () => {
    const packet = buildSimulatedCompleteArticleEvidencePacket('soil-types-before-planting');

    expect(packet.releaseGate.releaseTimestampPlaceholder).toBe('release timestamp pending');
    expect(packet.releaseGate.blockers).toContain('release_timestamp_placeholder_required');
  });

  test('release note placeholder is required', () => {
    const packet = buildSimulatedCompleteArticleEvidencePacket('soil-types-before-planting');

    expect(packet.releaseGate.releaseNotePlaceholder).toBe('release note pending');
    expect(packet.releaseGate.blockers).toContain('release_note_placeholder_required');
  });

  test('pilot article remains non-final', () => {
    const summary = getArticleEvidencePacketSummary();

    expect(summary.finalPublishAllowedCount).toBe(0);
    expect(summary.packets.every((packet) => packet.isFinalOfficialArticle === false)).toBe(true);
    expect(summary.packets.every((packet) => packet.finalPublishAllowed === false)).toBe(true);
  });

  test('safety disclaimer is still required', () => {
    const packet = buildArticleEvidencePacket('soil-types-before-planting');

    expect(packet.safetyDisclaimerConfirmed).toBe(true);
    expect(packet.releaseGate.blockers).toContain('metadata_incomplete');
    expect(packet.releaseGate.humanApprovalRequired).toBe(true);
  });
});
