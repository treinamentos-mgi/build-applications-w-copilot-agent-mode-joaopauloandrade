import { CapabilityCard } from './CapabilityCard.js';
import { ApiResourceContent } from './ApiResourceContent.js';

type Team = { name: string; mascot: string; members: unknown[] };
type TeamsResponse = { teams: Team[] };

export default function Teams() {
  return (
    <CapabilityCard title="Equipes" description="Gerencie equipes e integrantes.">
      <ApiResourceContent<TeamsResponse>
        path="/api/teams"
        isEmpty={({ teams }) => teams.length === 0}
        emptyText="Sem equipes cadastradas no momento."
      >
        {({ teams }) => (
          <ul className="list-group">
            {teams.map((team, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{team.name}</span>
                <span className="badge text-bg-secondary">{team.members.length} integrantes</span>
              </li>
            ))}
          </ul>
        )}
      </ApiResourceContent>
    </CapabilityCard>
  );
}
