import { CapabilityCard } from './CapabilityCard.js';
import { ApiResourceContent } from './ApiResourceContent.js';

type Activity = { type: string; minutes: number; points: number };
type ActivitiesResponse = { activities: Activity[] };

const tipoAtividade: Record<string, string> = { run: 'Corrida', cycle: 'Ciclismo', strength: 'Força' };

export default function Activities() {
  return (
    <CapabilityCard title="Atividades" description="Acompanhe os minutos de atividade e os pontos das pessoas participantes.">
      <ApiResourceContent<ActivitiesResponse>
        path="/api/activities"
        isEmpty={({ activities }) => activities.length === 0}
        emptyText="Sem atividades registradas no momento."
      >
        {({ activities }) => (
          <div className="table-responsive">
            <table className="table">
              <thead><tr><th scope="col">Tipo</th><th scope="col">Minutos</th><th scope="col">Pontos</th></tr></thead>
              <tbody>
                {activities.map((activity, index) => (
                  <tr key={index}>
                    <td>{tipoAtividade[activity.type] ?? activity.type}</td>
                    <td>{activity.minutes}</td>
                    <td>{activity.points}</td>
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
