import { Activity, Team, User, Workout } from '../models/index.js';

export async function listActivities() {
  return Activity.find().lean();
}

type Input = Record<string, unknown>;

const activityInputPaths = ['user', 'team', 'type', 'minutes'];
const teamInputPaths = ['name', 'mascot'];
const focusByActivityType: Record<string, string> = { run: 'endurance', cycle: 'endurance', strength: 'strength' };
const focusLabel: Record<string, string> = { endurance: 'resistência', strength: 'força' };

function httpError(status: number, message: string) {
  return Object.assign(new Error(message), { status });
}

function readInput(input: unknown): Input {
  return (input ?? {}) as Input;
}

export async function createActivity(input: unknown) {
  const { userId, teamId, type, minutes } = readInput(input);
  const activity = new Activity({ user: userId, team: teamId, type, minutes, points: minutes, occurredAt: new Date() });
  if (activity.validateSync(activityInputPaths)) {
    throw httpError(400, 'Informe usuário, equipe, tipo e minutos válidos para registrar a atividade');
  }
  const [userExists, teamExists] = await Promise.all([User.exists({ _id: activity.user }), Team.exists({ _id: activity.team })]);
  if (!userExists || !teamExists) {
    throw httpError(404, 'Usuário ou equipe não encontrados');
  }
  await activity.save();
  return activity.toObject();
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  const { name, mascot, members } = readInput(input);
  const team = new Team({ name, mascot, members });
  if (team.validateSync(teamInputPaths)) {
    throw httpError(400, 'Informe nome e mascote válidos para criar a equipe');
  }
  await team.save();
  return team.toObject();
}

export async function getLeaderboard() {
  const rows = await Activity.aggregate([
    { $group: { _id: '$team', totalPoints: { $sum: '$points' } } },
    { $lookup: { from: Team.collection.name, localField: '_id', foreignField: '_id', as: 'team' } },
    { $unwind: '$team' },
    { $sort: { totalPoints: -1, 'team.name': 1 } },
  ]);
  return rows.map((row, index) => ({ teamId: row._id, teamName: row.team.name, totalPoints: row.totalPoints, rank: index + 1 }));
}

export async function suggestWorkouts(userEmail: string) {
  const user = await User.findOne({ email: userEmail.trim().toLowerCase() }).lean();
  if (!user) {
    throw httpError(404, 'Pessoa usuária não encontrada');
  }
  const latest = await Activity.findOne({ user: user._id }).sort({ occurredAt: -1 }).lean();
  const activityFocus = latest ? focusByActivityType[latest.type] : undefined;
  const focus = activityFocus ?? user.fitnessGoal;
  const reason = activityFocus
    ? `Combina com sua atividade recente de ${focusLabel[focus] ?? focus}`
    : 'Combina com a sua meta de treino';
  const workouts = await Workout.find({ focus }).limit(5).lean();
  return workouts.map((workout) => ({ ...workout, reason }));
}

export { User };
