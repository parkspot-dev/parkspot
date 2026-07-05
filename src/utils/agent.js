export default function getAgentUserNameFromFullName(dropdownName) {
    if (!dropdownName) return null;

    const agents = JSON.parse(localStorage.getItem('agents')) || [];

    const matchedAgent = agents.find((agent) => {
        if (!agent.FullName) return false;

        const firstNameFromFullName = agent.FullName.split(' ')[0]; 

        return firstNameFromFullName === dropdownName;
    });

    return matchedAgent ? matchedAgent.UserName : null;
}
