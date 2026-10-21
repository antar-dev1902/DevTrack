import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Icon from '../components/icons/ImageIcon.jsx';
import PathSelector from '../components/PathSelector.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import Roadmap from '../components/Roadmap.jsx';
import SkillDetailsPanel from '../components/SkillDetailsPanel.jsx';
import LearningGoalCard from '../components/LearningGoalCard.jsx';
import { useLearningPreferences } from '../context/LearningPreferencesContext.js';
import { selectCompletedSkillIds } from '../store/selectors.js';
import { skillCompleted } from '../store/progressSlice.js';
import { paths, skills, getPathStatuses, getPathProgress } from '../data/roadmapData.js';
import '../styles/learnRoadmap.css';

function defaultSkillFor(path, completedSkillIds) {
  const statuses = getPathStatuses(path, completedSkillIds);
  return (statuses.find((skill) => skill.status === 'current') || statuses[0]).id;
}

export default function LearnRoadmap() {
  const dispatch = useDispatch();
  const completedSkillIds = useSelector(selectCompletedSkillIds);
  const { preferredPathId, setPreferredPath } = useLearningPreferences();
  const preferredPath = paths.find((path) => path.id === preferredPathId);
  const [searchParams, setSearchParams] = useSearchParams({ skill: defaultSkillFor(preferredPath, completedSkillIds) });
  const requestedSkillId = searchParams.get('skill');
  const selectedPath = paths.find((path) => path.skillIds.includes(requestedSkillId)) || preferredPath;
  const selectedSkillId = selectedPath.skillIds.includes(requestedSkillId)
    ? requestedSkillId : defaultSkillFor(selectedPath, completedSkillIds);
  const selectedSkill = skills[selectedSkillId];
  const completedCount = selectedPath.skillIds.filter((id) => completedSkillIds.includes(id)).length;
  const pathProgress = getPathProgress(selectedPath, completedSkillIds);

  const selectPath = (pathId) => {
    const path = paths.find((item) => item.id === pathId);
    setPreferredPath(pathId);
    setSearchParams({ skill: defaultSkillFor(path, completedSkillIds) });
  };

  return (
    <div className="learn-page section">
      <div className="container">
        <header className="learn-header">
          <span className="learn-eyebrow"><Icon name="compass" size={15} /> Skills & roadmap</span>
          <h1>Your Learning Path</h1>
          <p>Choose a path, build your skills, and put them into practice.</p>
        </header>

        <PathSelector paths={paths} selectedId={selectedPath.id} onSelect={selectPath} />

        <section className="path-overview card" aria-labelledby="path-overview-title">
          <div className="path-overview-copy">
            <h2 id="path-overview-title">{selectedPath.name}</h2>
            <p>{selectedPath.description}</p>
          </div>
          <div className="path-overview-progress">
            <div className="path-progress-caption">
              <span><strong>{completedCount}</strong> of {selectedPath.skillIds.length} skills completed</span>
              <strong>{pathProgress}%</strong>
            </div>
            <div
              role="progressbar"
              aria-label={`${selectedPath.name} progress`}
              aria-valuenow={pathProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <ProgressBar value={pathProgress} />
            </div>
          </div>
        </section>

        <LearningGoalCard suggestedSkillId={selectedSkillId} />

        <div className="learn-grid">
          <Roadmap
            path={selectedPath}
            selectedSkillId={selectedSkillId}
            onSelectSkill={(id) => setSearchParams({ skill: id })}
            completedSkillIds={completedSkillIds}
          />
          <SkillDetailsPanel
            skill={selectedSkill}
            skillNumber={selectedPath.skillIds.indexOf(selectedSkillId) + 1}
            totalSkills={selectedPath.skillIds.length}
            isCompleted={completedSkillIds.includes(selectedSkillId)}
            onComplete={() => selectedSkill && dispatch(skillCompleted(selectedSkill.id))}
          />
        </div>
      </div>
    </div>
  );
}
