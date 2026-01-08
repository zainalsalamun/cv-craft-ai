import { forwardRef } from 'react';
import { CVData, CVSettings } from '@/types/cv';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface CVPreviewProps {
  data: CVData;
  settings: CVSettings;
}

export const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(
  ({ data, settings }, ref) => {
    const { template, fontSize, showPhoto, showProjects, showCertificates } = settings;
    
    const fontSizeClass = {
      small: 'text-[9px]',
      medium: 'text-[10px]',
      large: 'text-[11px]',
    }[fontSize];

    if (template === 'creative') {
      return <CreativeTemplate ref={ref} data={data} settings={settings} fontSizeClass={fontSizeClass} />;
    }

    if (template === 'classic') {
      return <ClassicTemplate ref={ref} data={data} settings={settings} fontSizeClass={fontSizeClass} />;
    }

    return <ModernTemplate ref={ref} data={data} settings={settings} fontSizeClass={fontSizeClass} />;
  }
);

CVPreview.displayName = 'CVPreview';

// Modern Template
const ModernTemplate = forwardRef<HTMLDivElement, CVPreviewProps & { fontSizeClass: string }>(
  ({ data, settings, fontSizeClass }, ref) => {
    const { personalInfo, summary, workExperience, education, skills, projects, certificates, languages } = data;
    const { showPhoto, showProjects, showCertificates, accentColor } = settings;

    return (
      <div ref={ref} className={`a4-preview w-full overflow-hidden rounded-lg ${fontSizeClass}`}>
        <div className="h-full p-6" style={{ ['--accent' as any]: accentColor }}>
          {/* Header */}
          <div className="mb-4 border-b-2 pb-4" style={{ borderColor: accentColor }}>
            <div className="flex items-start gap-4">
              {showPhoto && personalInfo.photo && (
                <img
                  src={personalInfo.photo}
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {personalInfo.fullName || 'Your Name'}
                </h1>
                <p className="text-sm font-medium" style={{ color: accentColor }}>
                  {personalInfo.jobTitle || 'Your Title'}
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-[9px] text-gray-600">
                  {personalInfo.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {personalInfo.email}
                    </span>
                  )}
                  {personalInfo.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {personalInfo.phone}
                    </span>
                  )}
                  {personalInfo.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {personalInfo.location}
                    </span>
                  )}
                  {personalInfo.linkedin && (
                    <span className="flex items-center gap-1">
                      <Linkedin className="h-3 w-3" />
                      {personalInfo.linkedin}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-4">
              <h2 className="mb-1 text-xs font-bold uppercase tracking-wide" style={{ color: accentColor }}>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {workExperience.length > 0 && (
            <div className="mb-4">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: accentColor }}>
                Work Experience
              </h2>
              <div className="space-y-3">
                {workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-gray-600">{exp.company} {exp.location && `• ${exp.location}`}</p>
                      </div>
                      <span className="text-[9px] text-gray-500">
                        {exp.startDate} – {exp.isPresent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.bullets.filter(b => b).length > 0 && (
                      <ul className="mt-1 list-disc pl-4 text-gray-700">
                        {exp.bullets.filter(b => b).map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-4">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: accentColor }}>
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                      {edu.notes && <p className="text-gray-500 text-[9px]">{edu.notes}</p>}
                    </div>
                    <span className="text-[9px] text-gray-500">
                      {edu.startYear} – {edu.endYear}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-4">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: accentColor }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full px-2 py-0.5 text-[9px]"
                    style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {showProjects && projects.length > 0 && (
            <div className="mb-4">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: accentColor }}>
                Projects
              </h2>
              <div className="space-y-2">
                {projects.map((project) => (
                  <div key={project.id}>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-[9px] text-gray-600">{project.role}</p>
                    <p className="text-gray-700">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h2 className="mb-1 text-xs font-bold uppercase tracking-wide" style={{ color: accentColor }}>
                Languages
              </h2>
              <p className="text-gray-700">
                {languages.map((lang) => `${lang.name} (${lang.level})`).join(' • ')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ModernTemplate.displayName = 'ModernTemplate';

// Classic Template
const ClassicTemplate = forwardRef<HTMLDivElement, CVPreviewProps & { fontSizeClass: string }>(
  ({ data, settings, fontSizeClass }, ref) => {
    const { personalInfo, summary, workExperience, education, skills, projects, certificates, languages } = data;
    const { showPhoto, showProjects, showCertificates } = settings;

    return (
      <div ref={ref} className={`a4-preview w-full overflow-hidden rounded-lg ${fontSizeClass}`}>
        <div className="h-full p-6">
          {/* Header */}
          <div className="mb-4 border-b-2 border-gray-900 pb-3 text-center">
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="mt-1 text-sm text-gray-700">
              {personalInfo.jobTitle || 'Your Title'}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-[9px] text-gray-600">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.location && <span>• {personalInfo.location}</span>}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-4">
              <h2 className="mb-1 text-xs font-bold uppercase border-b border-gray-300 pb-1">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {workExperience.length > 0 && (
            <div className="mb-4">
              <h2 className="mb-2 text-xs font-bold uppercase border-b border-gray-300 pb-1">
                Professional Experience
              </h2>
              <div className="space-y-3">
                {workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{exp.position}</h3>
                        <p className="italic text-gray-700">{exp.company}</p>
                      </div>
                      <span className="text-[9px] text-gray-600">
                        {exp.startDate} – {exp.isPresent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.bullets.filter(b => b).length > 0 && (
                      <ul className="mt-1 list-disc pl-4 text-gray-700">
                        {exp.bullets.filter(b => b).map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-4">
              <h2 className="mb-2 text-xs font-bold uppercase border-b border-gray-300 pb-1">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <p className="italic text-gray-700">{edu.institution}</p>
                    </div>
                    <span className="text-[9px] text-gray-600">
                      {edu.startYear} – {edu.endYear}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-4">
              <h2 className="mb-1 text-xs font-bold uppercase border-b border-gray-300 pb-1">
                Skills
              </h2>
              <p className="text-gray-700">
                {skills.map((skill) => skill.name).join(' • ')}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ClassicTemplate.displayName = 'ClassicTemplate';

// Creative Template
const CreativeTemplate = forwardRef<HTMLDivElement, CVPreviewProps & { fontSizeClass: string }>(
  ({ data, settings, fontSizeClass }, ref) => {
    const { personalInfo, summary, workExperience, education, skills, projects, languages } = data;
    const { showPhoto, showProjects, accentColor } = settings;

    return (
      <div ref={ref} className={`a4-preview w-full overflow-hidden rounded-lg ${fontSizeClass}`}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-[30%] p-4 text-white" style={{ backgroundColor: accentColor }}>
            {showPhoto && personalInfo.photo && (
              <img
                src={personalInfo.photo}
                alt="Profile"
                className="mx-auto mb-4 h-20 w-20 rounded-full border-2 border-white/30 object-cover"
              />
            )}
            
            <div className="mb-4">
              <h2 className="mb-2 text-[10px] font-bold uppercase tracking-wider opacity-80">Contact</h2>
              <div className="space-y-1 text-[9px]">
                {personalInfo.email && (
                  <p className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {personalInfo.email}
                  </p>
                )}
                {personalInfo.phone && (
                  <p className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {personalInfo.phone}
                  </p>
                )}
                {personalInfo.location && (
                  <p className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {personalInfo.location}
                  </p>
                )}
              </div>
            </div>

            {skills.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 text-[10px] font-bold uppercase tracking-wider opacity-80">Skills</h2>
                <div className="space-y-1">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <p className="text-[9px]">{skill.name}</p>
                      <div className="mt-0.5 h-1 rounded-full bg-white/20">
                        <div
                          className="h-full rounded-full bg-white"
                          style={{
                            width: skill.level === 'advanced' ? '100%' : skill.level === 'intermediate' ? '66%' : '33%',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages.length > 0 && (
              <div>
                <h2 className="mb-2 text-[10px] font-bold uppercase tracking-wider opacity-80">Languages</h2>
                <div className="space-y-1 text-[9px]">
                  {languages.map((lang) => (
                    <p key={lang.id}>{lang.name} – {lang.level}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-5">
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900">
                {personalInfo.fullName || 'Your Name'}
              </h1>
              <p className="text-sm font-medium" style={{ color: accentColor }}>
                {personalInfo.jobTitle || 'Your Title'}
              </p>
            </div>

            {summary && (
              <div className="mb-4">
                <h2 className="mb-1 text-[10px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                  About Me
                </h2>
                <p className="text-gray-700 leading-relaxed">{summary}</p>
              </div>
            )}

            {workExperience.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                  Experience
                </h2>
                <div className="space-y-3">
                  {workExperience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                        </div>
                        <span className="text-[9px] text-gray-500">
                          {exp.startDate} – {exp.isPresent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.bullets.filter(b => b).length > 0 && (
                        <ul className="mt-1 list-disc pl-4 text-gray-700">
                          {exp.bullets.filter(b => b).map((bullet, i) => (
                            <li key={i}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div>
                <h2 className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                  Education
                </h2>
                <div className="space-y-2">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution} • {edu.startYear}–{edu.endYear}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

CreativeTemplate.displayName = 'CreativeTemplate';
