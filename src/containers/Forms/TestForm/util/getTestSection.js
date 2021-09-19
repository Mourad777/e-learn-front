export const getTestSection = (
    page,
    isMcSection,
    isEssaySection,
    isSpeakingSection,
    isFillBlankSection,
    essaySectionPage,
    speakingSectionPage,
    fillBlankSectionPage,
) => {
    let section;
    if (page >= 1 && page < 5) section = `info${page}`;
    if (isMcSection && page === 5) section = 'mc';
    if (page === essaySectionPage && isEssaySection) section = 'essay';
    if (page === speakingSectionPage && isSpeakingSection) section = 'speaking'
    if (page === fillBlankSectionPage && isFillBlankSection)
        section = 'fillblanks'

    return section
}