import RoadmapNode from './RoadmapNode.jsx';
import { skills, getPathStatuses } from '../data/roadmapData.js';

export default function Roadmap({ path, selectedSkillId, onSelectSkill, completedSkillIds }) {
  const statuses = getPathStatuses(path, completedSkillIds);

  return (
    <div className="roadmap-panel card">
      <div className="roadmap-panel-header">
        <span className="roadmap-panel-eyebrow">{path.name.toUpperCase()}</span>
        <p>{path.description}</p>
      </div>

      <div className="roadmap-chain">
        {statuses.map(({ id: skillId, status }, i) => {
          const skill = skills[skillId];
          if (!skill) return null;
          return (
            <div key={skillId} className="roadmap-chain-step">
              <RoadmapNode
                label={skill.name}
                sublabel={status === 'current' ? 'In progress' : undefined}
                status={status}
                selected={selectedSkillId === skillId}
                onClick={() => onSelectSkill(skillId)}
                style={{ animationDelay: `${i * 0.06}s` }}
              />
              {i < path.skillIds.length - 1 && <span className="roadmap-connector" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
