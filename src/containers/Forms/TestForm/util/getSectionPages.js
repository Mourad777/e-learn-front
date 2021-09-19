export const getSectionPages = (isMcSection, isEssaySection, formPages) => {
    const essaySectionPage = isMcSection ? 6 : 5;
    let speakingSectionPage;
    if (isMcSection && isEssaySection) speakingSectionPage = 7;
    if (!(isMcSection) && isEssaySection)
      speakingSectionPage = 6;
    if (isMcSection && !(isEssaySection))
      speakingSectionPage = 6;
    if (!(isMcSection) && !(isEssaySection))
      speakingSectionPage = 5;
    return {
        mcSectionPage:5,
        essaySectionPage,
        speakingSectionPage,
        fillBlankSectionPage: formPages,
    }
}