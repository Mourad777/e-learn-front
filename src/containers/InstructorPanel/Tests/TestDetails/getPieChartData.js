export const getPieChartData = (test,width,t) => {
    return [
        {
          id: `${
            width > 560
              ? t("confirmations.takeTest.mc")
              : t("confirmations.takeTest.mcShort")
          } ${test.sectionWeights.mcSection}%`,
          label: t("confirmations.takeTest.mc"),
          value: test.sectionWeights.mcSection,
          color: "hsl(128, 70%, 50%)",
        },
        {
          id: `${t("confirmations.takeTest.essay")} ${
            test.sectionWeights.essaySection
          }%`,
          label: t("confirmations.takeTest.essay"),
          value: test.sectionWeights.essaySection,
          color: "hsl(88, 70%, 50%)",
        },
        {
          id: `${t("confirmations.takeTest.speaking")} ${
            test.sectionWeights.speakingSection
          }%`,
          label: t("confirmations.takeTest.speaking"),
          value: test.sectionWeights.speakingSection,
          color: "hsl(245, 70%, 50%)",
        },
        {
          id: `${
            width > 560
              ? t("confirmations.takeTest.fillblanks")
              : t("confirmations.takeTest.fillblanksShort")
          } ${test.sectionWeights.fillBlankSection}%`,
          label: t("confirmations.takeTest.fillblanks"),
          value: test.sectionWeights.fillBlankSection,
          color: "hsl(340, 70%, 50%)",
        },
      ].filter((sec) => sec.value);
}