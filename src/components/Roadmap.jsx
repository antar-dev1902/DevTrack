import RoadmapNode from './RoadmapNode.jsx';
import { skills, getPathStatuses } from '../data/roadmapData.js';

export default function Roadmap({ path, selectedSkillId, onSelectSkill, completedSkillIds }) {
  const statuses = getPathStatuses(path, completedSkillIds);

  return (
    <section className="roadmap-panel card" aria-labelledby="roadmap-title">
      <div className="roadmap-panel-header">
        <h2 id="roadmap-title">Skills in this path</h2>
        <span>{path.skillIds.length} skills</span>
      </div>
      <ol className="roadmap-chain">
        {statuses.map(({ id, status }, index) => (
          <li key={id}>
            <RoadmapNode
              label={skills[id].name}
              number={index + 1}
              status={status}
              selected={selectedSkillId === id}
              onClick={() => onSelectSkill(id)}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
