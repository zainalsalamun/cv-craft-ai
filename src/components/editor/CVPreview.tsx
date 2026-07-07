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

    if (template === 'minimalist') {
      return <MinimalistTemplate ref={ref} data={data} settings={settings} fontSizeClass={fontSizeClass} />;
    }

    if (template === 'professional') {
      return <ProfessionalTemplate ref={ref} data={data} settings={settings} fontSizeClass={fontSizeClass} />;
    }

    if (template === 'executive') {
      return <ExecutiveTemplate ref={ref} data={data} settings={settings} fontSizeClass={fontSizeClass} />;
    }

    if (template === 'tech') {
      return <TechTemplate ref={ref} data={data} settings={settings} fontSizeClass={fontSizeClass} />;
    }

    if (template === 'harvard') {
      return <HarvardTemplate ref={ref} data={data} settings={settings} fontSizeClass={fontSizeClass} />;
    }

    if (template === 'startup') {
      return <StartupTemplate ref={ref} data={data} settings={settings} fontSizeClass={fontSizeClass} />;
    }

    if (template === 'elegant') {
      return <ElegantTemplate ref={ref} data={data} settings={settings} fontSizeClass={fontSizeClass} />;
    }

    if (template === 'academic') {
      return <AcademicTemplate ref={ref} data={data} settings={settings} fontSizeClass={fontSizeClass} />;
    }

    if (template === 'infographic') {
      return <InfographicTemplate ref={ref} data={data} settings={settings} fontSizeClass={fontSizeClass} />;
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
                    {(!exp.bullets ? [] : exp.bullets).filter(b => b).length > 0 && (
                      <ul className="mt-1 list-disc pl-4 text-gray-700">
                        {(!exp.bullets ? [] : exp.bullets).filter(b => b).map((bullet, i) => (
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
                    {(!exp.bullets ? [] : exp.bullets).filter(b => b).length > 0 && (
                      <ul className="mt-1 list-disc pl-4 text-gray-700">
                        {(!exp.bullets ? [] : exp.bullets).filter(b => b).map((bullet, i) => (
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
                <p className="text-gray-700 leading-relaxed break-words whitespace-pre-wrap">{summary}</p>
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
                      {(!exp.bullets ? [] : exp.bullets).filter(b => b).length > 0 && (
                        <ul className="mt-1 list-disc pl-4 text-gray-700 break-words whitespace-pre-wrap">
                          {(!exp.bullets ? [] : exp.bullets).filter(b => b).map((bullet, i) => (
                            <li key={i} className="break-words">{bullet}</li>
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

// Professional Template
const ProfessionalTemplate = forwardRef<HTMLDivElement, CVPreviewProps & { fontSizeClass: string }>(
  ({ data, settings, fontSizeClass }, ref) => {
    const { personalInfo, summary, workExperience, education, skills, projects, certificates, languages } = data;
    const { showPhoto, showProjects, accentColor } = settings;

    return (
      <div ref={ref} className={`a4-preview w-full overflow-hidden rounded-lg ${fontSizeClass} bg-white`}>
        <div className="h-full px-8 py-8">
          <div className="flex justify-between items-end border-b-4 pb-4 mb-4" style={{ borderColor: accentColor }}>
            <div>
              <h1 className="text-3xl font-serif text-gray-900 tracking-tight">{personalInfo.fullName || 'Your Name'}</h1>
              <p className="text-sm font-semibold tracking-widest uppercase mt-1" style={{ color: accentColor }}>{personalInfo.jobTitle || 'Your Title'}</p>
            </div>
            <div className="text-right text-[9px] text-gray-600 space-y-0.5">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-2/3">
              {summary && (
                <div className="mb-5">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2">Profile</h2>
                  <p className="text-gray-700 leading-relaxed text-justify break-words whitespace-pre-wrap">{summary}</p>
                </div>
              )}

              {workExperience.length > 0 && (
                <div className="mb-5">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3">Professional Experience</h2>
                  <div className="space-y-4">
                    {workExperience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-gray-900 text-[11px]">{exp.position}</h3>
                          <span className="text-[9px] text-gray-500 font-medium">{exp.startDate} – {exp.isPresent ? 'Present' : exp.endDate}</span>
                        </div>
                        <p className="text-[10px] font-medium mb-1" style={{ color: accentColor }}>{exp.company}</p>
                        {(!exp.bullets ? [] : exp.bullets).filter(b => b).length > 0 && (
                          <ul className="list-disc pl-4 text-gray-700 space-y-1 break-words whitespace-pre-wrap">
                            {(!exp.bullets ? [] : exp.bullets).filter(b => b).map((bullet, i) => (
                              <li key={i} className="break-words">{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-1/3 space-y-5">
              {education.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2">Education</h2>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="font-bold text-gray-900 text-[10px]">{edu.degree}</h3>
                        <p className="text-gray-600 leading-snug">{edu.institution}</p>
                        <p className="text-[9px] text-gray-500">{edu.startYear} – {edu.endYear}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {skills.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2">Expertise</h2>
                  <ul className="list-none space-y-1 text-gray-700">
                    {skills.map((skill) => (
                      <li key={skill.id} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></div>
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
ProfessionalTemplate.displayName = 'ProfessionalTemplate';

// Minimalist Template
const MinimalistTemplate = forwardRef<HTMLDivElement, CVPreviewProps & { fontSizeClass: string }>(
  ({ data, settings, fontSizeClass }, ref) => {
    const { personalInfo, summary, workExperience, education, skills } = data;
    const { accentColor } = settings;

    return (
      <div ref={ref} className={`a4-preview w-full overflow-hidden rounded-lg ${fontSizeClass} bg-white`}>
        <div className="h-full px-10 py-10">
          <header className="text-center mb-8">
            <h1 className="text-2xl font-light tracking-[0.2em] text-gray-900 uppercase">{personalInfo.fullName || 'Your Name'}</h1>
            <p className="text-xs tracking-widest uppercase mt-2 text-gray-500">{personalInfo.jobTitle || 'Your Title'}</p>
            <div className="flex justify-center gap-4 mt-3 text-[9px] text-gray-400">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
            </div>
          </header>

          <div className="max-w-2xl mx-auto">
            {summary && (
              <div className="mb-6 text-center">
                <p className="text-gray-600 leading-relaxed italic break-words whitespace-pre-wrap">"{summary}"</p>
              </div>
            )}

            {workExperience.length > 0 && (
              <div className="mb-6 relative">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">Experience</h2>
                <div className="space-y-6">
                  {workExperience.map((exp) => (
                    <div key={exp.id} className="grid grid-cols-4 gap-4">
                      <div className="col-span-1 text-right text-[9px] text-gray-400 font-medium pt-1">
                        {exp.startDate} — {exp.isPresent ? 'Present' : exp.endDate}
                      </div>
                      <div className="col-span-3 border-l px-4" style={{ borderColor: `${accentColor}40` }}>
                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-[9px] text-gray-500 mb-2 uppercase tracking-wide">{exp.company}</p>
                        {(!exp.bullets ? [] : exp.bullets).filter(b => b).length > 0 && (
                          <ul className="text-gray-600 space-y-1 break-words whitespace-pre-wrap">
                            {(!exp.bullets ? [] : exp.bullets).filter(b => b).map((bullet, i) => (
                              <li key={i} className="break-words">- {bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div className="mb-6">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">Education</h2>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="grid grid-cols-4 gap-4">
                      <div className="col-span-1 text-right text-[9px] text-gray-400 font-medium pt-0.5">
                        {edu.startYear} — {edu.endYear}
                      </div>
                      <div className="col-span-3 border-l px-4" style={{ borderColor: `${accentColor}40` }}>
                        <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-500">{edu.institution}</p>
                      </div>
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
MinimalistTemplate.displayName = 'MinimalistTemplate';

// Executive Template
const ExecutiveTemplate = forwardRef<HTMLDivElement, CVPreviewProps & { fontSizeClass: string }>(
  ({ data, settings, fontSizeClass }, ref) => {
    const { personalInfo, summary, workExperience, education, skills, certificates } = data;
    const { accentColor } = settings;

    return (
      <div ref={ref} className={`a4-preview w-full overflow-hidden rounded-lg ${fontSizeClass} bg-white`}>
        <div className="h-full px-12 py-10 max-w-[800px] mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-wide uppercase">
              {personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-sm font-semibold tracking-widest uppercase mt-1 mb-3" style={{ color: accentColor }}>
              {personalInfo.jobTitle || 'Your Title'}
            </p>
            <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-[9.5px] font-medium text-gray-600">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {(personalInfo.email && personalInfo.phone) && <span className="text-gray-300">|</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {((personalInfo.email || personalInfo.phone) && personalInfo.location) && <span className="text-gray-300">|</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {((personalInfo.email || personalInfo.phone || personalInfo.location) && personalInfo.linkedin) && <span className="text-gray-300">|</span>}
              {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            </div>
          </div>

          <hr className="border-t-2 border-gray-800 mb-6" />

          {/* Core Competencies (Skills) */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3 border-b pb-1" style={{ borderBottomColor: accentColor }}>
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-800 font-medium">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Executive Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2 border-b pb-1" style={{ borderBottomColor: accentColor }}>
                Executive Summary
              </h2>
              <p className="text-gray-800 leading-relaxed text-justify break-words whitespace-pre-wrap font-serif text-[10px]">{summary}</p>
            </div>
          )}

          {/* Professional Experience */}
          {workExperience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3 border-b pb-1" style={{ borderBottomColor: accentColor }}>
                Professional Experience
              </h2>
              <div className="space-y-5">
                {workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-end mb-1">
                      <h3 className="font-bold text-gray-900 text-[11px] uppercase tracking-wide">{exp.position}</h3>
                      <span className="text-[10px] text-gray-600 font-bold">{exp.startDate} – {exp.isPresent ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="text-[10px] font-bold italic mb-2" style={{ color: accentColor }}>{exp.company}</p>
                    {(!exp.bullets ? [] : exp.bullets).filter(b => b).length > 0 && (
                      <ul className="list-disc pl-4 text-gray-800 space-y-1 break-words whitespace-pre-wrap font-serif text-[10px]">
                        {(!exp.bullets ? [] : exp.bullets).filter(b => b).map((bullet, i) => (
                          <li key={i} className="break-words pl-1 leading-relaxed">{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Certifications */}
          {(education.length > 0 || certificates?.length > 0) && (
            <div className="grid grid-cols-2 gap-8">
              {education.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3 border-b pb-1" style={{ borderBottomColor: accentColor }}>
                    Education
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="font-bold text-gray-900 text-[10.5px]">{edu.degree}</h3>
                        <p className="text-gray-700 italic">{edu.institution}</p>
                        <p className="text-[9.5px] text-gray-600 font-medium">{edu.startYear} – {edu.endYear}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {certificates && certificates.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-3 border-b pb-1" style={{ borderBottomColor: accentColor }}>
                    Certifications
                  </h2>
                  <div className="space-y-2">
                    {certificates.map((cert: any) => (
                      <div key={cert.id}>
                        <h3 className="font-bold text-gray-900 text-[10.5px]">{cert.name}</h3>
                        <p className="text-gray-700 italic">{cert.issuer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
ExecutiveTemplate.displayName = 'ExecutiveTemplate';

// Tech Template
const TechTemplate = forwardRef<HTMLDivElement, CVPreviewProps & { fontSizeClass: string }>(
  ({ data, settings, fontSizeClass }, ref) => {
    const { personalInfo, summary, workExperience, education, skills, projects } = data;
    const { showProjects, accentColor } = settings;

    return (
      <div ref={ref} className={`a4-preview w-full overflow-hidden rounded-lg ${fontSizeClass} bg-[#F8FAFC]`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-slate-900 text-white px-8 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: accentColor }}>{personalInfo.fullName || 'Your Name'}</h1>
                <p className="text-[12px] font-mono text-slate-300 mb-3">~/{personalInfo.jobTitle?.toLowerCase().replace(/\s+/g, '-') || 'your-title'}</p>
              </div>
              <div className="text-right text-[9.5px] space-y-1 font-mono text-slate-400">
                {personalInfo.email && <p className="flex items-center justify-end gap-2"><span>{personalInfo.email}</span><Mail className="w-3 h-3 text-slate-500" /></p>}
                {personalInfo.phone && <p className="flex items-center justify-end gap-2"><span>{personalInfo.phone}</span><Phone className="w-3 h-3 text-slate-500" /></p>}
                {personalInfo.github && <p className="flex items-center justify-end gap-2"><span className="text-white">{personalInfo.github}</span><Github className="w-3 h-3" style={{ color: accentColor }} /></p>}
                {personalInfo.linkedin && <p className="flex items-center justify-end gap-2"><span className="text-white">{personalInfo.linkedin}</span><Linkedin className="w-3 h-3" style={{ color: accentColor }} /></p>}
              </div>
            </div>
            {summary && (
              <div className="mt-4 border-t border-slate-700 pt-4">
                <p className="text-slate-300 leading-relaxed break-words whitespace-pre-wrap text-[10px]">&gt; {summary}</p>
              </div>
            )}
          </div>

          <div className="flex flex-1 p-6 gap-6">
            {/* Main Content */}
            <div className="w-2/3 space-y-6">
              {workExperience.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-slate-900" style={{ backgroundColor: accentColor }}></span>
                    Experience
                  </h2>
                  <div className="space-y-4 border-l-2 border-slate-200 ml-2 pl-4">
                    {workExperience.map((exp) => (
                      <div key={exp.id} className="relative">
                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                        <h3 className="font-bold text-slate-900 text-[11px]">{exp.position}</h3>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-[10px] font-semibold text-slate-700">{exp.company}</p>
                          <span className="text-[9px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{exp.startDate} – {exp.isPresent ? 'Present' : exp.endDate}</span>
                        </div>
                        {(!exp.bullets ? [] : exp.bullets).filter(b => b).length > 0 && (
                          <ul className="list-disc pl-3 text-slate-600 space-y-1 break-words whitespace-pre-wrap text-[9.5px]">
                            {(!exp.bullets ? [] : exp.bullets).filter(b => b).map((bullet, i) => (
                              <li key={i} className="break-words leading-relaxed pl-1">{bullet}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showProjects && projects && projects.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-slate-900" style={{ backgroundColor: accentColor }}></span>
                    Projects
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {projects.map((proj: any) => (
                      <div key={proj.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-[10.5px] flex items-center gap-1">
                          {proj.name}
                          {proj.link && <Globe className="w-2.5 h-2.5 text-slate-400" />}
                        </h3>
                        <p className="text-[9px] text-slate-600 mt-1 line-clamp-3 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Content */}
            <div className="w-1/3 space-y-6">
              {skills.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-slate-900" style={{ backgroundColor: accentColor }}></span>
                    Tech Stack
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => (
                      <span key={skill.id} className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 text-[9px] font-mono shadow-sm">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {education.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-4 h-0.5 bg-slate-900" style={{ backgroundColor: accentColor }}></span>
                    Education
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-[10px] leading-tight">{edu.degree}</h3>
                        <p className="text-slate-600 text-[9px] mt-1">{edu.institution}</p>
                        <p className="text-[8.5px] font-mono text-slate-400 mt-1">{edu.startYear} – {edu.endYear}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
TechTemplate.displayName = 'TechTemplate';

// Harvard Template (Classic Academic ATS)
const HarvardTemplate = forwardRef<HTMLDivElement, CVPreviewProps & { fontSizeClass: string }>(
  ({ data, settings, fontSizeClass }, ref) => {
    const { personalInfo, summary, workExperience, education, skills, projects } = data;
    
    return (
      <div ref={ref} className={`a4-preview w-full overflow-hidden rounded-lg ${fontSizeClass} bg-white`}>
        <div className="h-full px-16 py-12 max-w-[800px] mx-auto font-serif">
          {/* Header */}
          <div className="text-center mb-4 border-b-2 border-black pb-3">
            <h1 className="text-2xl font-bold text-black uppercase tracking-widest mb-2">
              {personalInfo.fullName || 'YOUR NAME'}
            </h1>
            <div className="flex justify-center flex-wrap gap-x-2 text-[10px] text-black">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.location && <span>•</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.phone && <span>•</span>}
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.linkedin && <span>•</span>}
              {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-4">
              <p className="text-black text-[10px] leading-snug break-words whitespace-pre-wrap">{summary}</p>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-4">
              <h2 className="text-[11px] font-bold text-black uppercase mb-1 border-b border-black">Education</h2>
              <div className="space-y-2 mt-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-[10px] text-black">
                    <div className="flex justify-between items-start font-bold">
                      <span>{edu.institution}</span>
                      <span>{edu.startYear} – {edu.endYear}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="italic">{edu.degree}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {workExperience.length > 0 && (
            <div className="mb-4">
              <h2 className="text-[11px] font-bold text-black uppercase mb-1 border-b border-black">Experience</h2>
              <div className="space-y-3 mt-2">
                {workExperience.map((exp) => (
                  <div key={exp.id} className="text-[10px] text-black">
                    <div className="flex justify-between items-start font-bold">
                      <span>{exp.company}</span>
                      <span>{exp.startDate} – {exp.isPresent ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="italic mb-1">{exp.position}</div>
                    {(!exp.bullets ? [] : exp.bullets).filter(b => b).length > 0 && (
                      <ul className="list-disc pl-5 space-y-0.5 break-words whitespace-pre-wrap">
                        {(!exp.bullets ? [] : exp.bullets).filter(b => b).map((bullet, i) => (
                          <li key={i} className="break-words pl-1">{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-4">
              <h2 className="text-[11px] font-bold text-black uppercase mb-1 border-b border-black">Skills & Interests</h2>
              <div className="mt-2 text-[10px] text-black">
                <span className="font-bold">Technical Skills: </span>
                {skills.map(s => s.name).join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);
HarvardTemplate.displayName = 'HarvardTemplate';

// Startup Template (Bold, Modern Sans)
const StartupTemplate = forwardRef<HTMLDivElement, CVPreviewProps & { fontSizeClass: string }>(
  ({ data, settings, fontSizeClass }, ref) => {
    const { personalInfo, summary, workExperience, education, skills, projects } = data;
    const { accentColor, showPhoto, showProjects } = settings;
    
    return (
      <div ref={ref} className={`a4-preview w-full overflow-hidden rounded-lg ${fontSizeClass} bg-white font-sans`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-10 py-8 bg-zinc-50 border-b border-zinc-200">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight leading-none mb-2">
                  {personalInfo.fullName || 'Your Name'}
                </h1>
                <p className="text-lg font-medium" style={{ color: accentColor }}>
                  {personalInfo.jobTitle || 'Your Title'}
                </p>
                <div className="flex flex-wrap gap-x-4 mt-3 text-[10px] font-medium text-zinc-500">
                  {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {personalInfo.email}</span>}
                  {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {personalInfo.phone}</span>}
                  {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" /> {personalInfo.linkedin}</span>}
                </div>
              </div>
              {showPhoto && personalInfo.photo && (
                <img src={personalInfo.photo} alt="Profile" className="w-24 h-24 object-cover rounded-2xl shadow-sm border-2 border-white ml-6" />
              )}
            </div>
            {summary && (
              <p className="mt-5 text-[11px] text-zinc-700 leading-relaxed font-medium break-words whitespace-pre-wrap max-w-3xl">
                {summary}
              </p>
            )}
          </div>

          <div className="flex-1 p-10 grid grid-cols-12 gap-8">
            {/* Left Column (Main) */}
            <div className="col-span-8 space-y-8">
              {workExperience.length > 0 && (
                <section>
                  <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-4 border-b-2 pb-1" style={{ borderColor: accentColor }}>
                    Experience
                  </h2>
                  <div className="space-y-6">
                    {workExperience.map((exp) => (
                      <div key={exp.id}>
                        <h3 className="font-bold text-[12px] text-zinc-900">{exp.position}</h3>
                        <div className="flex justify-between items-center mt-0.5 mb-2">
                          <p className="text-[11px] font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                          <span className="text-[9px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">{exp.startDate} – {exp.isPresent ? 'Present' : exp.endDate}</span>
                        </div>
                        {(!exp.bullets ? [] : exp.bullets).filter(b => b).length > 0 && (
                          <ul className="text-zinc-600 space-y-1.5 break-words whitespace-pre-wrap text-[10px]">
                            {(!exp.bullets ? [] : exp.bullets).filter(b => b).map((bullet, i) => (
                              <li key={i} className="break-words flex gap-2">
                                <span className="text-zinc-300 mt-0.5">•</span>
                                <span className="flex-1">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {showProjects && projects && projects.length > 0 && (
                <section>
                  <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-4 border-b-2 pb-1" style={{ borderColor: accentColor }}>
                    Projects
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {projects.map((proj: any) => (
                      <div key={proj.id} className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                        <h3 className="font-bold text-[11px] text-zinc-900">{proj.name}</h3>
                        <p className="text-[9.5px] text-zinc-600 mt-1 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column (Sidebar) */}
            <div className="col-span-4 space-y-8">
              {skills.length > 0 && (
                <section>
                  <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-4 border-b-2 pb-1" style={{ borderColor: accentColor }}>
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill.id} className="px-2.5 py-1 bg-zinc-100 text-zinc-800 text-[9.5px] font-bold rounded-lg">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {education.length > 0 && (
                <section>
                  <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-4 border-b-2 pb-1" style={{ borderColor: accentColor }}>
                    Education
                  </h2>
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="font-bold text-zinc-900 text-[11px] leading-tight">{edu.degree}</h3>
                        <p className="text-zinc-600 text-[10px] mt-0.5">{edu.institution}</p>
                        <p className="text-[9px] font-bold text-zinc-400 mt-1">{edu.startYear} – {edu.endYear}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
StartupTemplate.displayName = 'StartupTemplate';

// Elegant Template (Sophisticated with serif fonts and decorative elements)
const ElegantTemplate = forwardRef<HTMLDivElement, CVPreviewProps & { fontSizeClass: string }>(
  ({ data, settings, fontSizeClass }, ref) => {
    const { personalInfo, summary, workExperience, education, skills, languages } = data;
    const { accentColor, showPhoto } = settings;

    return (
      <div ref={ref} className={`a4-preview w-full overflow-hidden rounded-lg ${fontSizeClass} bg-white font-serif`}>
        <div className="h-full flex">
          {/* Left Sidebar */}
          <div className="w-[35%] p-6" style={{ backgroundColor: `${accentColor}08` }}>
            {showPhoto && personalInfo.photo && (
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full opacity-20" style={{ backgroundColor: accentColor }} />
                  <img src={personalInfo.photo} alt="Profile" className="relative h-20 w-20 rounded-full object-cover border-2" style={{ borderColor: accentColor }} />
                </div>
              </div>
            )}

            <div className="mb-5">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
                Contact
              </h2>
              <div className="space-y-2 text-[9px] text-gray-600">
                {personalInfo.email && <p className="flex items-center gap-2"><Mail className="h-3 w-3" style={{ color: accentColor }} />{personalInfo.email}</p>}
                {personalInfo.phone && <p className="flex items-center gap-2"><Phone className="h-3 w-3" style={{ color: accentColor }} />{personalInfo.phone}</p>}
                {personalInfo.location && <p className="flex items-center gap-2"><MapPin className="h-3 w-3" style={{ color: accentColor }} />{personalInfo.location}</p>}
                {personalInfo.linkedin && <p className="flex items-center gap-2"><Linkedin className="h-3 w-3" style={{ color: accentColor }} />{personalInfo.linkedin}</p>}
                {personalInfo.github && <p className="flex items-center gap-2"><Github className="h-3 w-3" style={{ color: accentColor }} />{personalInfo.github}</p>}
              </div>
            </div>

            {skills.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
                  Skills
                </h2>
                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-[9px] mb-0.5">
                        <span className="text-gray-700">{skill.name}</span>
                      </div>
                      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: accentColor,
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
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
                  Languages
                </h2>
                <div className="space-y-1.5 text-[9px]">
                  {languages.map((lang) => (
                    <div key={lang.id} className="flex justify-between">
                      <span className="text-gray-700">{lang.name}</span>
                      <span className="text-gray-500 italic">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Content */}
          <div className="flex-1 p-7">
            <div className="mb-5 pb-4 border-b" style={{ borderColor: `${accentColor}20` }}>
              <h1 className="text-2xl font-bold text-gray-900 tracking-wide" style={{ color: '#1a1a1a' }}>
                {personalInfo.fullName || 'Your Name'}
              </h1>
              <p className="text-sm font-medium tracking-[0.15em] uppercase mt-1" style={{ color: accentColor }}>
                {personalInfo.jobTitle || 'Your Title'}
              </p>
            </div>

            {summary && (
              <div className="mb-5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>
                  Profile
                </h2>
                <p className="text-gray-600 leading-relaxed italic break-words whitespace-pre-wrap text-[10px]">{summary}</p>
              </div>
            )}

            {workExperience.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
                  Experience
                </h2>
                <div className="space-y-4">
                  {workExperience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-gray-900 text-[11px]">{exp.position}</h3>
                        <span className="text-[8px] text-gray-500 tracking-wider">{exp.startDate} – {exp.isPresent ? 'Present' : exp.endDate}</span>
                      </div>
                      <p className="text-[9px] font-medium italic mb-1" style={{ color: accentColor }}>{exp.company}</p>
                      {(!exp.bullets ? [] : exp.bullets).filter(b => b).length > 0 && (
                        <ul className="text-gray-600 space-y-0.5 break-words whitespace-pre-wrap text-[9px] ml-1">
                          {(!exp.bullets ? [] : exp.bullets).filter(b => b).map((bullet, i) => (
                            <li key={i} className="break-words flex gap-1.5">
                              <span style={{ color: accentColor }}>›</span>
                              <span>{bullet}</span>
                            </li>
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
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: `${accentColor}30` }}>
                  Education
                </h2>
                <div className="space-y-2">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-gray-900 text-[10px]">{edu.degree}</h3>
                        <span className="text-[8px] text-gray-500">{edu.startYear} – {edu.endYear}</span>
                      </div>
                      <p className="text-[9px] text-gray-600 italic">{edu.institution}</p>
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
ElegantTemplate.displayName = 'ElegantTemplate';

// Academic Template (Scholarly, publication-style)
const AcademicTemplate = forwardRef<HTMLDivElement, CVPreviewProps & { fontSizeClass: string }>(
  ({ data, settings, fontSizeClass }, ref) => {
    const { personalInfo, summary, workExperience, education, skills, projects, certificates, languages } = data;
    const { accentColor, showProjects, showCertificates } = settings;
    const darkColor = '#1a2332';

    return (
      <div ref={ref} className={`a4-preview w-full overflow-hidden rounded-lg ${fontSizeClass} bg-white`}>
        <div className="h-full">
          {/* Dark Header */}
          <div className="px-8 py-5 text-white" style={{ backgroundColor: darkColor }}>
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-[0.15em] uppercase">
                {personalInfo.fullName || 'Your Name'}
              </h1>
              <p className="text-[10px] font-medium tracking-[0.3em] uppercase mt-1 opacity-70">
                {personalInfo.jobTitle || 'Your Title'}
              </p>
              <div className="flex justify-center flex-wrap gap-x-3 mt-3 text-[9px] opacity-60">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                {personalInfo.location && <span>• {personalInfo.location}</span>}
                {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
              </div>
            </div>
          </div>

          <div className="px-8 py-5">
            {/* Research / Professional Summary */}
            {summary && (
              <div className="mb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 pb-1 border-b-2" style={{ borderColor: darkColor, color: darkColor }}>
                  Research Interests & Summary
                </h2>
                <p className="text-gray-700 leading-relaxed text-justify break-words whitespace-pre-wrap">{summary}</p>
              </div>
            )}

            {/* Education (prominent in academic CVs) */}
            {education.length > 0 && (
              <div className="mb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 pb-1 border-b-2" style={{ borderColor: darkColor, color: darkColor }}>
                  Education
                </h2>
                <div className="space-y-2">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 text-[10.5px]">{edu.degree}</h3>
                          <p className="text-gray-600 text-[9.5px]">{edu.institution}</p>
                          {edu.notes && <p className="text-gray-500 text-[9px] italic">{edu.notes}</p>}
                        </div>
                        <span className="text-[9px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                          {edu.startYear} – {edu.endYear}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Experience */}
            {workExperience.length > 0 && (
              <div className="mb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 pb-1 border-b-2" style={{ borderColor: darkColor, color: darkColor }}>
                  Professional Experience
                </h2>
                <div className="space-y-3">
                  {workExperience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <h3 className="font-bold text-gray-900 text-[10.5px]">{exp.position}</h3>
                          <p className="text-gray-600 text-[9.5px] italic">{exp.company}{exp.location && `, ${exp.location}`}</p>
                        </div>
                        <span className="text-[9px] text-gray-500 font-medium">{exp.startDate} – {exp.isPresent ? 'Present' : exp.endDate}</span>
                      </div>
                      {(!exp.bullets ? [] : exp.bullets).filter(b => b).length > 0 && (
                        <ul className="mt-1 list-disc pl-4 text-gray-700 text-[9.5px] break-words whitespace-pre-wrap">
                          {(!exp.bullets ? [] : exp.bullets).filter(b => b).map((bullet, i) => (
                            <li key={i} className="break-words pl-0.5">{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications / Projects */}
            {showProjects && projects && projects.length > 0 && (
              <div className="mb-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 pb-1 border-b-2" style={{ borderColor: darkColor, color: darkColor }}>
                  Publications & Projects
                </h2>
                <div className="space-y-2">
                  {projects.map((proj: any) => (
                    <div key={proj.id}>
                      <h3 className="font-bold text-gray-900 text-[10px]">{proj.name}</h3>
                      <p className="text-[9px] text-gray-600 italic">{proj.role}</p>
                      <p className="text-gray-700 text-[9.5px] mt-0.5">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills & Certifications row */}
            <div className="grid grid-cols-2 gap-6">
              {skills.length > 0 && (
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 pb-1 border-b-2" style={{ borderColor: darkColor, color: darkColor }}>
                    Technical Skills
                  </h2>
                  <p className="text-gray-700 text-[9.5px]">
                    {skills.map(s => s.name).join(' · ')}
                  </p>
                </div>
              )}

              {showCertificates && certificates && certificates.length > 0 && (
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 pb-1 border-b-2" style={{ borderColor: darkColor, color: darkColor }}>
                    Certifications
                  </h2>
                  <div className="space-y-1">
                    {certificates.map((cert: any) => (
                      <div key={cert.id}>
                        <p className="text-gray-900 text-[9.5px] font-medium">{cert.name}</p>
                        <p className="text-gray-500 text-[8.5px]">{cert.issuer} • {cert.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Languages */}
            {languages.length > 0 && (
              <div className="mt-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-2 pb-1 border-b-2" style={{ borderColor: darkColor, color: darkColor }}>
                  Languages
                </h2>
                <p className="text-gray-700 text-[9.5px]">
                  {languages.map(l => `${l.name} (${l.level})`).join(' · ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
AcademicTemplate.displayName = 'AcademicTemplate';

// Infographic Template (Visual, data-driven with gradient header)
const InfographicTemplate = forwardRef<HTMLDivElement, CVPreviewProps & { fontSizeClass: string }>(
  ({ data, settings, fontSizeClass }, ref) => {
    const { personalInfo, summary, workExperience, education, skills, projects, languages } = data;
    const { accentColor, showPhoto, showProjects } = settings;

    const skillLevelWidth = (level: string) =>
      level === 'advanced' ? 'w-full' : level === 'intermediate' ? 'w-2/3' : 'w-1/3';

    return (
      <div ref={ref} className={`a4-preview w-full overflow-hidden rounded-lg ${fontSizeClass} bg-white font-sans`}>
        <div className="h-full flex flex-col">
          {/* Gradient Header */}
          <div
            className="relative px-8 py-6 text-white"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc, #6366f1)` }}
          >
            <div className="flex items-center gap-5">
              {showPhoto && personalInfo.photo && (
                <img src={personalInfo.photo} alt="Profile" className="h-16 w-16 rounded-xl object-cover border-2 border-white/30 shadow-lg" />
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {personalInfo.fullName || 'Your Name'}
                </h1>
                <p className="text-[11px] font-medium tracking-widest uppercase opacity-80 mt-0.5">
                  {personalInfo.jobTitle || 'Your Title'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-[9px] opacity-75">
              {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
              {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.location}</span>}
              {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{personalInfo.linkedin}</span>}
              {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{personalInfo.github}</span>}
            </div>
          </div>

          <div className="flex flex-1">
            {/* Main Column */}
            <div className="w-[62%] p-6">
              {summary && (
                <div className="mb-4">
                  <h2 className="text-[10px] font-extrabold uppercase tracking-[0.15em] mb-2 flex items-center gap-2" style={{ color: accentColor }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    About Me
                  </h2>
                  <p className="text-gray-600 leading-relaxed break-words whitespace-pre-wrap text-[9.5px]">{summary}</p>
                </div>
              )}

              {workExperience.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-[10px] font-extrabold uppercase tracking-[0.15em] mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    Experience
                  </h2>
                  <div className="space-y-3 border-l-2 ml-1 pl-4" style={{ borderColor: `${accentColor}25` }}>
                    {workExperience.map((exp) => (
                      <div key={exp.id} className="relative">
                        <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: accentColor }} />
                        <h3 className="font-bold text-gray-900 text-[10.5px]">{exp.position}</h3>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[9.5px] font-semibold" style={{ color: accentColor }}>{exp.company}</p>
                          <span className="text-[8px] font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: `${accentColor}90` }}>
                            {exp.startDate} – {exp.isPresent ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        {(!exp.bullets ? [] : exp.bullets).filter(b => b).length > 0 && (
                          <ul className="text-gray-600 space-y-0.5 break-words whitespace-pre-wrap text-[9px]">
                            {(!exp.bullets ? [] : exp.bullets).filter(b => b).map((bullet, i) => (
                              <li key={i} className="break-words flex gap-1.5">
                                <span style={{ color: accentColor }}>▸</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showProjects && projects && projects.length > 0 && (
                <div>
                  <h2 className="text-[10px] font-extrabold uppercase tracking-[0.15em] mb-2 flex items-center gap-2" style={{ color: accentColor }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    Projects
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {projects.map((proj: any) => (
                      <div key={proj.id} className="rounded-lg p-2.5 border" style={{ borderColor: `${accentColor}20`, backgroundColor: `${accentColor}05` }}>
                        <h3 className="font-bold text-gray-900 text-[9.5px]">{proj.name}</h3>
                        <p className="text-[8.5px] text-gray-600 mt-0.5 leading-relaxed line-clamp-2">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-[38%] p-5" style={{ backgroundColor: `${accentColor}06` }}>
              {/* Skills with visual bars */}
              {skills.length > 0 && (
                <div className="mb-5">
                  <h2 className="text-[10px] font-extrabold uppercase tracking-[0.15em] mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    Skills
                  </h2>
                  <div className="space-y-2">
                    {skills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between text-[9px] mb-0.5">
                          <span className="text-gray-700 font-medium">{skill.name}</span>
                          <span className="text-gray-400 capitalize text-[8px]">{skill.level}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${skillLevelWidth(skill.level)}`}
                            style={{ backgroundColor: accentColor }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div className="mb-5">
                  <h2 className="text-[10px] font-extrabold uppercase tracking-[0.15em] mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    Education
                  </h2>
                  <div className="space-y-2.5">
                    {education.map((edu) => (
                      <div key={edu.id} className="pb-2 border-b last:border-0" style={{ borderColor: `${accentColor}15` }}>
                        <h3 className="font-bold text-gray-900 text-[9.5px]">{edu.degree}</h3>
                        <p className="text-[9px] text-gray-600">{edu.institution}</p>
                        <p className="text-[8px] text-gray-400 mt-0.5">{edu.startYear} – {edu.endYear}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languages.length > 0 && (
                <div>
                  <h2 className="text-[10px] font-extrabold uppercase tracking-[0.15em] mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: accentColor }} />
                    Languages
                  </h2>
                  <div className="space-y-1.5">
                    {languages.map((lang) => (
                      <div key={lang.id} className="flex justify-between items-center text-[9px]">
                        <span className="text-gray-700">{lang.name}</span>
                        <span className="text-[8px] px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: `${accentColor}80` }}>
                          {lang.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
InfographicTemplate.displayName = 'InfographicTemplate';
