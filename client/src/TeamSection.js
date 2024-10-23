import TeamMember from './TeamMember';

function TeamSection({ title, members }) {
    return (
        <div className="team-section">
            <h2 className="section-title">{title}</h2>
            <div className="team-member-grid">
                {members.map((member, idx) => (
                    <TeamMember key={idx} {...member} />
                ))}
            </div>
        </div>
    );
}

export default TeamSection;
