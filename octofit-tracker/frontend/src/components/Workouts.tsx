import { CapabilityCard } from './CapabilityCard.js';
import { ApiResourceContent } from './ApiResourceContent.js';

type Suggestion = { title: string; reason: string };
type WorkoutsResponse = { suggestions: Suggestion[] };

const emailPessoa = 'mona@example.com';

export default function Workouts() {
  return (
    <CapabilityCard title="Sugestões de treino" description="Receba recomendações de treino com base nos seus padrões de atividade.">
      <ApiResourceContent<WorkoutsResponse>
        path={`/api/workouts/suggestions/${encodeURIComponent(emailPessoa)}`}
        isEmpty={({ suggestions }) => suggestions.length === 0}
        emptyText="Sem sugestões de treino no momento."
      >
        {({ suggestions }) => (
          <ul className="list-group">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="list-group-item">
                <strong>{suggestion.title}</strong>
                <div className="text-body-secondary small">{suggestion.reason}</div>
              </li>
            ))}
          </ul>
        )}
      </ApiResourceContent>
    </CapabilityCard>
  );
}
