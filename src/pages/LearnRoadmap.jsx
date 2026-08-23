import { useState, useEffect, useMemo } from 'react';
import Icon from '../components/icons/ImageIcon.jsx';
import PathSelector from '../components/PathSelector.jsx';
import Roadmap from '../components/Roadmap.jsx';
import SkillDetailsPanel from '../components/SkillDetailsPanel.jsx';
import { paths, skills, getPathStatuses } from '../data/roadmapData.js';
import '../styles/learnRoadmap.css';

function defaultSkillFor(path, completedSkillIds) {
  const statuses = getPathStatuses(path, completedSkillIds);
  return (statuses.find((s) => s.status === 'current') || statuses[0]).id;
}

export default function LearnRoadmap({ completedSkillIds, onCompleteSkill }) {
  const [selectedPathId, setSelectedPathId] = useState(paths[0].id);
  const [selectedSkillId, setSelectedSkillId] = useState(() => defaultSkillFor(paths[0], completedSkillIds));

  const selectedPath = useMemo(
    () => paths.find((p) => p.id === selectedPathId),
    [selectedPathId],
  );

  // When the developer path changes, jump the detail panel to that path's
  // current skill instead of leaving a stale skill selected.
  useEffect(() => {
    setSelectedSkillId(defaultSkillFor(selectedPath, completedSkillIds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPath]);

  const selectedSkill = skills[selectedSkillId];
  const isSelectedSkillCompleted = completedSkillIds.includes(selectedSkillId);

  return (
    <div className="learn-page section">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">
            <Icon name="compass" size={14} />
            Skills
          </span>
          <h2>What should you learn next?</h2>
          <p>Pick a path to see the roadmap. Pick a skill to see exactly how to learn it.</p>
        </div>

        <PathSelector paths={paths} selectedId={selectedPathId} onSelect={setSelectedPathId} completedSkillIds={completedSkillIds} />

        <div className="learn-grid">
          <Roadmap
            path={selectedPath}
            selectedSkillId={selectedSkillId}
            onSelectSkill={setSelectedSkillId}
            completedSkillIds={completedSkillIds}
          />
          <SkillDetailsPanel
            skill={selectedSkill}
            isCompleted={isSelectedSkillCompleted}
            onComplete={() => selectedSkill && onCompleteSkill(selectedSkill.id)}
          />
        </div>
      </div>
    </div>
  );
}
