import hashlib
import json

from django.conf import settings
from django.utils import timezone

from apps.votes.models import Vote


def _sha256(payload):
    return hashlib.sha256(payload.encode('utf-8')).hexdigest()


def _get_previous_hash(election_id):
    previous_vote = (
        Vote.objects
        .filter(election_id=election_id, vote_cast_tx_hash__isnull=False)
        .exclude(vote_cast_tx_hash='')
        .order_by('-timestamp', '-id')
        .first()
    )
    return previous_vote.vote_cast_tx_hash if previous_vote else 'GENESIS'

def deploy_election_contract(election):
    """
    Lightweight deployment stub for school projects.
    Returns a deterministic-looking 0x address and can later be replaced
    with a real Hardhat/Anvil deployment call.
    """
    payload = {
        'election_id': election.id,
        'organisation_id': election.organisation_id,
        'timestamp': timezone.now().isoformat(),
        'salt': getattr(settings, 'BLOCKCHAIN_SALT', 'school-project'),
    }
    return f"0x{_sha256(json.dumps(payload, sort_keys=True))[:40]}"


def anchor_vote(vote):
    """
    Produce a deterministic vote anchor hash using a simple hash-chain.
    This is intentionally lightweight for school-project use.
    """
    payload = {
        'vote_id': vote.id,
        'contract_address': vote.election.smart_contract_address or 'UNDEPLOYED',
        'election_id': vote.election_id,
        'position_id': vote.position_id,
        'voted_for_id': vote.voted_for_id,
        'timestamp': vote.timestamp.isoformat(),
        'previous_hash': _get_previous_hash(vote.election_id),
        'salt': getattr(settings, 'BLOCKCHAIN_SALT', 'school-project'),
    }
    return f"0x{_sha256(json.dumps(payload, sort_keys=True))}"
