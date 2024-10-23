function TeamMember({ name, role, image, linkedin, instagram, github, email }) {
    return (
        <div className="card-border">
            <div className="team-member-card">
                <img src={image} alt={name} className="member-photo" />
                <h3>{name}</h3>
                <p>{role}</p>
                <div className="social-links">
                    {github && (
                        <a className="socialImg" href={github} target="_blank" rel="noopener noreferrer">
                            <img src="socialHandle/github.svg" style={{ filter: "invert(1)" }} alt="Github" />
                        </a>
                    )}
                    <a className="socialImg" href={linkedin} target="_blank" rel="noopener noreferrer">
                        <img src="socialHandle/linkedin.svg" style={{ filter: 'invert(1)' }} alt="LinkedIn" />
                    </a>
                    <a className="socialImg" href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
                        <img src='socialHandle/email.svg' style={{ filter: 'invert(1)' }} alt="Email" />
                    </a>

                </div>
            </div>
        </div>
    );
}

export default TeamMember;
