from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.users.models import Election
from services.voting_link_service import dispatch_voter_invites_for_election


class Command(BaseCommand):
    help = (
        'Send voter invite links for elections that have started and have not '
        'yet dispatched invites.'
    )

    def handle(self, *args, **options):
        now = timezone.now()
        elections = (
            Election.objects
            .filter(
                date_time_occuring__lte=now,
                date_time_ending__gt=now,
                voter_invites_sent_at__isnull=True,
            )
            .order_by('date_time_occuring', 'id')
        )

        if not elections.exists():
            self.stdout.write(self.style.SUCCESS('No elections pending scheduled invite dispatch.'))
            return

        self.stdout.write(
            f'Processing {elections.count()} election(s) for scheduled voter invite dispatch...'
        )

        total_sent = 0
        total_errors = 0
        for election in elections:
            summary = dispatch_voter_invites_for_election(
                election=election,
                generated_by=None,
                skip_if_already_dispatched=True,
            )
            total_sent += summary['sent_count']
            total_errors += len(summary['errors'])
            self.stdout.write(
                f"- election_id={election.id}: sent={summary['sent_count']} "
                f"created={summary['links_created']} refreshed={summary['links_refreshed']} "
                f"errors={len(summary['errors'])}"
            )

        self.stdout.write(
            self.style.SUCCESS(
                f'Scheduled invite dispatch complete. sent={total_sent}, errors={total_errors}.'
            )
        )
