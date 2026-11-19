import { CapabilityCard } from './CapabilityCard.js';
import { ApiResourceContent } from './ApiResourceContent.js';

type LeaderboardEntry = { teamName: string; totalPoints: number; rank: number };
type LeaderboardResponse = { leaderboard: LeaderboardEntry[] };

export default function Leaderboard() {
  return (
    <CapabilityCard title="Placar" description="Compare a pontuação total das equipes.">
      <ApiResourceContent<LeaderboardResponse>
        path="/api/leaderboard"
        isEmpty={({ leaderboard }) => leaderboard.length === 0}
        emptyText="Sem placar disponível no momento."
      >
        {({ leaderboard }) => (
          <div className="table-responsive">
            <table className="table">
              <thead><tr><th scope="col">Posição</th><th scope="col">Equipe</th><th scope="col">Pontos</th></tr></thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry.rank}>
                    <td>{entry.rank}</td>
                    <td>{entry.teamName}</td>
                    <td>{entry.totalPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ApiResourceContent>
    </CapabilityCard>
  );
}
