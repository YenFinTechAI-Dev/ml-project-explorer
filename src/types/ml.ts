export type ProjectCategory = 
  | 'regression'
  | 'classification'
  | 'clustering'
  | 'recommendation'
  | 'anomaly'
  | 'timeseries'
  | 'nlp'
  | 'cv';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface MLProject {
  id: string;
  title: string;
  category: ProjectCategory;
  categoryName: string;
  shortDesc: string;
  businessProblem: string;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  datasets: {
    name: string;
    source: string;
    url?: string;
    description: string;
    size: string;
  }[];
  features: string[];
  algorithms: {
    baseline: string;
    advanced: string;
    deepLearning?: string;
  };
  metrics: {
    name: string;
    target: string;
    explanation: string;
  }[];
  pipelineSteps: string[];
  pythonCodeSnippet: string;
  cvHighlightTip: string;
  tags: string[];
}

export interface ProjectIdeaParams {
  domain: string;
  level: DifficultyLevel;
  dataType: string;
  goal: string;
}

export interface GeneratedProjectPlan {
  title: string;
  domain: string;
  summary: string;
  datasetRecommendation: string;
  coreArchitecture: string[];
  techStack: string[];
  milestones: { step: string; detail: string }[];
  cvHeadline: string;
}
