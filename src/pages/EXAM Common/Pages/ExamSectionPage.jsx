import React, { useState } from "react";
import QuantSection from "./QuantSection";
import VerbalSection from "./VerbalSection";
import DataInsightsSection from "./DataInsightsSection";

const sectionsOrder = [
  { key: "quant", title: "Quant", component: QuantSection, time: 15 * 60 },
  { key: "verbal", title: "Verbal", component: VerbalSection, time: 15 * 60 },
  { key: "datainsights", title: "DataInsights", component: DataInsightsSection, time: 15 * 60 },
];

const AdaptiveExamPage = ({ testName }) => {
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [sessionId, setSessionId] = useState(null);

  const currentSection = sectionsOrder[currentSectionIdx];
  const SectionComponent = currentSection.component;

  const handleSectionComplete = () => {
    if (currentSectionIdx + 1 < sectionsOrder.length) {
      setCurrentSectionIdx((idx) => idx + 1);
    } else {
      // alert("Exam finished! Go to profile to see results.");
    }
  };

  return (
    <div>
      {/* Pass current index and total */}
      <SectionComponent
        testName={testName}
        sectionKey={currentSection.key}
        sectionTitle={currentSection.title}
        timeForSection={currentSection.time}
        onSectionComplete={handleSectionComplete}
        sessionId={sessionId}
        setSessionId={setSessionId}
        currentSectionIdx={currentSectionIdx}
        totalSections={sectionsOrder.length}
      />
    </div>
  );
};


export default AdaptiveExamPage;
