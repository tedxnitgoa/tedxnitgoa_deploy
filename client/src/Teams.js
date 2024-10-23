import TeamSection from './TeamSection';
import teamData from './teamData';  // Import the data for team members

function Team() {
    return (
        <>
            <div className="team-box">
                <div className='our_team_head'>
                    <video width="100%" height="auto" autoPlay muted>
                        <source src="/our_team.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="team-container">
                    {teamData.map((section, idx) => (
                        <TeamSection key={idx} title={section.title} members={section.members} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Team;
