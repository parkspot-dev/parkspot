export default function getAgentUserNameFromFullName(fullName) {
    if (!fullName) return null;

    const agents = JSON.parse(localStorage.getItem('agent')) || [];

    // exact FullName match
    const matchedAgent = agents.find(
        (a) =>
            a.FullName &&
            a.FullName.trim().toLowerCase() === fullName.trim().toLowerCase(),
    );

    return matchedAgent ? matchedAgent.UserName : null;
}
