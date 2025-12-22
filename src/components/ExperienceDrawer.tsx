import React from "react";
import SvgIcon from "@/components/SvgIcon";
import TechIcon from "@/components/TechIcon";
import { ExperienceItem } from "@/data/experience";
import { ExternalLink, Dot, CheckCircle2, ChevronRight } from "lucide-react";

interface ExperienceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  experiences: ExperienceItem[];
}

const ExperienceDrawer: React.FC<ExperienceDrawerProps> = ({
  isOpen,
  onClose,
  experiences,
}) => {
  if (!isOpen || experiences.length === 0) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-end">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-full h-[90vh] bg-[rgba(0,0,0,0.5)] rounded-t-3xl pb-[100px]">
        {/* Drawer header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[rgba(255,255,255,0.1)]">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Work Experience Details
          </h2>
          <button
            onClick={onClose}
            className="bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)] rounded-full p-2 transition-all duration-200 cursor-pointer"
          >
            <SvgIcon name="close" width={24} height={24} color="#fff" />
          </button>
        </div>

        {/* Drawer content area */}
        <div className="p-4 md:p-6 h-full overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            {experiences.map((experience, expIndex) => (
              <div
                key={expIndex}
                className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 md:p-6 space-y-6"
              >
                {/* Experience Header */}
                <div className="space-y-2">
                  {experience.companyUrl ? (
                    <a
                      href={experience.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-lg md:text-xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#93c5fd] bg-clip-text text-transparent hover:from-[#93c5fd] hover:to-[#60a5fa] transition-all group"
                    >
                      <span>{experience.name}</span>
                      <ExternalLink
                        size={14}
                        className="opacity-70 group-hover:opacity-100 transition-opacity text-[#60a5fa]"
                        strokeWidth={2.5}
                      />
                    </a>
                  ) : (
                    <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#60a5fa] to-[#93c5fd] bg-clip-text text-transparent">
                      {experience.name}
                    </h3>
                  )}
                  <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
                    <p className="text-[rgba(255,255,255,0.9)] font-semibold">
                      {experience.position}
                    </p>
                    <Dot size={16} className="text-[rgba(255,255,255,0.5)]" />
                    <p className="text-[rgba(255,255,255,0.7)] font-bold">
                      {experience.date}
                    </p>
                    {experience.location && (
                      <>
                        <Dot size={16} className="text-[rgba(255,255,255,0.5)]" />
                        <p className="text-[rgba(255,255,255,0.7)]">
                          {experience.location}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Tech Stack Section */}
                {experience.techStack && experience.techStack.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-base md:text-lg font-semibold text-white">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      {experience.techStack.map((tech, index) => (
                        <div key={index} className="flex items-center">
                          <TechIcon techName={tech} size="lg" />
                          {index < experience.techStack.length - 1 && (
                            <div className="mx-2 w-1 h-1 bg-[rgba(255,255,255,0.3)] rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Achievements Section */}
                {experience.achievements &&
                  experience.achievements.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-base md:text-lg font-semibold text-white">
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {experience.achievements.map((achievement, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 text-[rgba(255,255,255,0.8)]"
                          >
                            <CheckCircle2
                              size={16}
                              className="text-emerald-500 mt-1 flex-shrink-0"
                            />
                            <span className="text-sm md:text-base leading-relaxed">
                              {achievement}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Responsibilities Section */}
                {experience.responsibilities &&
                  experience.responsibilities.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-base md:text-lg font-semibold text-white">
                        Responsibilities
                      </h4>
                      <ul className="space-y-2">
                        {experience.responsibilities.map(
                          (responsibility, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-[rgba(255,255,255,0.8)]"
                            >
                              <ChevronRight
                                size={16}
                                className="text-cyan-500 mt-1 flex-shrink-0"
                              />
                              <span className="text-sm md:text-base leading-relaxed">
                                {responsibility}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDrawer;
